
# **Hero Blog Project – Auto-Generated Blog**

A full-stack auto-generated blog built with **React**, **Node.js**, **PostgreSQL**, and **Docker**, fully deployed on **AWS EC2**.
The backend uses a free AI model to automatically generate articles, which are stored in PostgreSQL and displayed on the frontend.
This project demonstrates a production-grade workflow including Dockerization, environment management, and AWS deployment.

---

## **Table of Contents**

1. [Features](#features)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Environment Variables](#environment-variables)
5. [Local Setup](#local-setup)
6. [Production Setup](#production-setup)
7. [Flow of Execution](#flow-of-execution)
8. [AI Article Generation](#ai-article-generation)
9. [Known Limitations](#known-limitations)
10. [License](#license)

---

## **Features**

* Fetch and display blog articles on the frontend.
* View full content of each article.
* Automatically generate **1 new AI-generated article per day**.
* Project auto-initializes with **3 preloaded articles**.
* Backend exposes REST endpoints:

  * `GET /articles`
  * `GET /health`
* WebSockets notify the frontend when new articles are added.
* Dockerized backend, frontend, and database.
* Production-ready deployment on AWS EC2.

---

## **Architecture**

A simple but production-ready 3-service architecture:

* **Frontend (React + Vite)**

  * Served using `serve` in production
  * Communicates with backend via REST + WebSockets

* **Backend (Node.js + Express)**

  * Connects to PostgreSQL
  * Generates articles using OpenRouter AI model
  * Sends real-time updates to frontend

* **Database (PostgreSQL)**

  * Persistent Docker volume
  * Stores generated articles

* **Orchestration (Docker Compose)**

  * Services start in correct order using custom wait scripts

* **Deployment (AWS EC2)**

  * Docker Compose runs in production
  * No external dependencies required

---

## **Tech Stack**

### **Frontend**

* React
* Vite
* Docker
* `serve`

### **Backend**

* Node.js (Express)
* WebSocket
* PostgreSQL client
* Cron-based daily scheduler
* Docker

### **AI Generation**

* OpenRouter API
* Model: **TNG: DeepSeek R1T2 Chimera (Free)**

### **Deployment**

* AWS EC2
* Docker & Docker Compose
* (Optional) ECR & CodeBuild for CI/CD

---

## **Environment Variables**

Create a `.env` file at the **project root**:

```
HERO_OPENROUTER_API_KEY=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
```

A `.env.example` file is included for guidance.

⚠️ **Your real `.env` is NOT pushed to GitHub** — it is ignored through `.gitignore`.

---

## **Local Setup**

1. **Clone the repository**

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

2. **Create a `.env` file**
   Copy `.env.example` → `.env` and fill in your values.

3. **Start all services**

```bash
docker-compose --env-file .env up --build
```

The app will be available at:

```
Frontend: http://localhost:3000
Backend: http://localhost:8080
```

---

## **Production Setup (AWS EC2)**

1. Install Docker & Docker Compose on the EC2 instance
2. Clone the repository
3. Add the `.env` file to the server
4. Start the app in detached mode:

```bash
docker-compose --env-file .env up -d --build
```

Site becomes available through  EC2 public IP or domain.

---

## **Flow of Execution**

### **1. Database starts first**

* PostgreSQL container initializes its volume.

### **2. Backend waits for database**

* A `wait-for-postgres.sh` script ensures PostgreSQL is fully ready.
* Backend checks if the articles table exists.
* If missing:

  * Generates **3 initial articles** using OpenRouter AI.
  * Stores them in PostgreSQL.

### **3. Frontend waits for backend**

* A script polls `http://backend:8080/health`.
* Once ready, the frontend loads the preloaded articles.

### **4. Daily article generation**

* A cron scheduler runs once per day.
* Generates a fresh AI-written article.
* Sends it to frontend via WebSocket in real-time.

### **Final result**

When users open the site:

* Initial articles are already displayed.
* New articles appear automatically as they are generated.
* No page refresh is required — updates are pushed instantly via WebSocket.

---

## **AI Article Generation**

* Powered by **OpenRouter Free Model: TNG: DeepSeek R1T2 Chimera**.
* Articles follow a structured JSON format.
* Fallback system:

  * If the AI returns malformed JSON, the backend inserts a safe fallback article.
  * Ensures the blog **never breaks** due to AI output.

---

## **Known Limitations**

* Free AI model can occasionally return incomplete or malformed responses.
* Article generation is intentionally simple (no images, no categories).
* Daily cron timing is based on the container’s timezone.
* No authentication system (this is a public blog demo).

---

## **License**

This project is released under the **MIT License**.
You may use, modify, and distribute it freely.

---
