const express = require('express')
const multer = require('multer')
const pdfParse = require('pdf-parse')
const fs = require('fs')
const { GoogleGenAI } = require('@google/genai')
const { QdrantClient } = require('@qdrant/js-client-rest')
require('dotenv').config()

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY
})

const createEmbedding = async(text)=>{
    const response = await ai.models.embedContent({
        model: 'gemini-embedding-2',
        contents: text,
    })

    return response.embeddings[0].values
}

const app = express()

const upload = multer({dest: "uploads/"})

app.get('/', (req, res)=>{
    res.send("Server is on")
})

app.get('/create-collection', async(req, res)=>{
    try {
        await qdrant.createCollection('pdf-docs', {
            vectors: {
                size: 3072,
                distance: "Cosine",
            }
        })
        res.send("Collection is created")
    } 
    catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})

app.post('/upload', upload.single("pdf"), async(req, res)=>{
    // console.log(req.file)
    // console.log(req.body)
    try {
        const dataBuffer = fs.readFileSync(req.file.path)
        const pdfData = await pdfParse(dataBuffer)
        const text = pdfData.text

        const chunks = text.split("\n\n").filter((chunk)=>chunk.trim() != '')

        const chunkEmbeddings = []
        for(const chunk of chunks){
            const embedding = await createEmbedding(chunk)

            chunkEmbeddings.push({
                text: chunk,
                embedding
            })
        }

        const points = chunkEmbeddings.map((item, index)=>({
            id: index+1,
            vector: item.embedding,
            payload: {
                text: item.text
            }
        }))

        await qdrant.upsert("pdf-docs", {
            points
        })

        const question = req.body.question
        const questionEmbedding = await createEmbedding(question)
        console.log(question)

        const searchResult = await qdrant.search("pdf-docs", {
            vector: questionEmbedding,
            limit: 1
        })
        console.log(searchResult);
        
        const bestChunk = searchResult[0].payload.text
        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash-lite',
            contents: `Answer the question using the context: ${bestChunk} and Question is: ${question}`
        })

        res.send(response.text)
    } 
    catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})
