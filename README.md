# 🕰️ Project Chronos: The AI Archeologist

## Overview

**Project Chronos: The AI Archeologist** is a next-generation language reconstruction framework designed to infer, rebuild, and contextualize fragmented or incomplete text data. Much like an archeologist reassembling ancient artifacts, ChronosAI reconstructs meaning from partial narratives, enabling seamless understanding of damaged, missing, or disordered textual content.

This project integrates modular AI-driven pipelines for semantic reconstruction, contextual inference, and information retrieval — leveraging advanced Large Language Models (LLMs) and real-time data synchronization. ChronosAI aims to serve as both an academic exploration of AI reasoning and a practical framework for text restoration in historical, research, and enterprise domains.

---

## Features

- **Fragment Reconstruction:** Rebuilds incomplete or partially corrupted text into coherent, contextually accurate sentences.  
- **Context-Aware Reasoning:** Maintains logical flow and narrative consistency throughout reconstructed passages.  
- **Modular AI Pipeline:** Built on FastAPI for high-speed inference and extensibility.  
- **API-Ready Architecture:** Easily deployable on local machines or cloud services.  
- **Configurable Backends:** Supports multiple LLM providers, including Google Gemini, OpenAI, and other compatible APIs.  
- **Lightweight & Scalable:** Designed for rapid prototyping and real-world integration.

---

## Setup Instructions

Follow these steps to install and run Project Chronos on a new machine.

### 1. Clone the Repository
```bash
git clone https://github.com/vparth75/ChronosAI.git
cd ChronosAI
```

### 2. Create and Activate a Virtual Environment

**Windows**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory of the project and add your API credentials.  
Example:
```
GEMINI_API_KEY=your_google_gemini_api_key_here
```

> **Note:** If additional APIs are used (e.g., OpenAI), include their keys in the same file.

### 5. Install Frontend Dependencies
```bash
npm install
npm run dev
```

### 6. Run the Application
Start the FastAPI server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## Usage Guide

You can interact with ChronosAI either via **CLI** or **API**.

### Command Line Interface
To reconstruct fragmented text directly:
```bash
python main.py "your fragmented text here"
```

Example:
```bash
python main.py "The lost empire of… was known for its… innovations."
```

Output:
```text
"The lost empire of Mayans was known for its astronomical innovations."
```

### API Access via Swagger UI
Once running, visit:
```
http://localhost:8000/docs
```
to explore all available endpoints through the interactive Swagger interface.

---

## Architecture Overview

ChronosAI is designed as a modular and extensible framework that combines backend AI orchestration with intelligent data flow management.

| Module | Description |
|--------|--------------|
| **Backend Service (FastAPI)** | Handles API requests, routing, and response serving. |
| **Keyword Extractor** | Identifies key fragments and contextual anchors in input text. |
| **LLM Engine** | Processes reconstruction and contextual completion using Gemini or compatible APIs. |
| **Memory & Context Store** | Maintains previous inferences to ensure narrative consistency. |
| **Frontend** | Connects via REST API or WebSocket for live inference and testing. |

## 🖥️ Frontend Details

This project uses **Vite + React + Tailwind CSS** for the frontend interface.

### Core Dependencies

| Package | Description |
|----------|--------------|
| **vite** | Modern, fast frontend build tool for development and production. |
| **react** | Library for building user interfaces using components. |
| **react-dom** | React DOM renderer for web applications. |
| **@vitejs/plugin-react** | Official Vite plugin for React with JSX and Fast Refresh support. |
| **@tailwindcss/vite** | Tailwind CSS integration plugin optimized for Vite projects. |

### Development Dependencies

| Package | Description |
|----------|--------------|
| **tailwindcss** | Utility-first CSS framework for styling. |
| **autoprefixer** | Automatically adds vendor prefixes to CSS for better browser support. |
| **postcss** | CSS transformation tool required for Tailwind’s build process. |

---

## Example Workflow

1. User inputs a fragmented text sample.  
2. Keyword Extractor isolates semantic anchors and missing regions.  
3. LLM Engine reconstructs missing content with contextual reasoning.  
4. The response is returned as a complete, coherent output.  

---

## Troubleshooting

- **Dependencies not installing:**  
  Run  
  ```bash
  pip install --upgrade pip
  pip install -r requirements.txt
  ```

- **.env not detected:**  
  Ensure you have installed `python-dotenv` and that the `.env` file is in the project root.

- **Server not starting:**  
  Check for syntax errors or ensure all dependencies (FastAPI, Uvicorn, dotenv, etc.) are correctly installed.

---

## Contributing

Contributions are welcome! Whether you’re improving documentation, fixing bugs, or adding new features:

1. Fork this repository.  
2. Create a new branch (`git checkout -b feature-name`).  
3. Make your changes and commit them.  
4. Push to your fork and open a Pull Request.  

For major changes, please open an issue first to discuss what you’d like to modify.

---

## License

This project is licensed under the **MIT License**.  
You’re free to use, modify, and distribute it, provided proper attribution is given.

---

## Acknowledgements

Project Chronos was inspired by the fusion of **linguistic archeology and artificial intelligence**, seeking to revive lost knowledge through modern computational means. It embodies the philosophy that AI can act not only as a predictive model but also as a digital historian — reconstructing, inferring, and preserving fragments of human thought. 

Parth and Vedh didn't know this project was due tonight. We haven't played clash royale today. 

---



