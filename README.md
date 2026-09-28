# Chat with PDF using RAG

A Node.js-based **Chat with PDF** application that uses **Retrieval-Augmented Generation (RAG)** to answer questions from uploaded PDF documents.

## 🚀 How It Works

The application follows this pipeline:

**PDF Upload → Text Extraction → Chunking → Embeddings → Qdrant Vector Database → Similarity Search → Gemini LLM → Answer**

### 1. PDF Upload

Users upload a PDF using an Express.js API. **Multer** handles the file upload.

### 2. Text Extraction

The uploaded PDF is processed using `pdf-parse` to extract its text content.

### 3. Text Chunking

The extracted text is divided into smaller chunks that can be converted into embeddings.

### 4. Embeddings

Each text chunk is converted into a vector embedding using the **Google Gemini Embedding API**.

### 5. Vector Storage

The generated embeddings and their corresponding text are stored in **Qdrant**, a vector database.

### 6. Semantic Search

When a user asks a question, the question is also converted into an embedding. Qdrant performs vector search to find the most relevant document content.

### 7. Answer Generation

The retrieved context is passed to **Google Gemini**, which generates an answer based on the relevant PDF content.

## 🛠️ Technologies Used

* Node.js
* Express.js
* JavaScript
* Google Gemini API
* Gemini Embeddings
* Qdrant Vector Database
* Multer
* pdf-parse
* dotenv
* REST API
* Retrieval-Augmented Generation (RAG)
* Vector/Semantic Search

## 📚 Key Learnings

* Understanding the RAG architecture
* Working with LLM APIs
* Generating and using text embeddings
* Working with vector databases
* Implementing semantic search
* PDF text extraction and processing
* Connecting retrieved context with LLM generation
* Building AI-powered backend APIs using Node.js

## 🔑 Environment Variables

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key
```

## 📌 Project Architecture

```text
                PDF
                 │
                 ▼
          PDF Text Extraction
                 │
                 ▼
             Chunking
                 │
                 ▼
        Gemini Embeddings
                 │
                 ▼
        Qdrant Vector DB
                 │
                 │
User Question ──► Embedding
                 │
                 ▼
          Vector Search
                 │
                 ▼
        Relevant PDF Context
                 │
                 ▼
            Gemini LLM
                 │
                 ▼
             Answer
```
