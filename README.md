## Hero Blog Project – Auto-Generated Blog

A full-stack auto-generated blog built using **React**, **Node.js**, **PostgreSQL**, **Docker**, and deployed on **AWS EC2**. The backend uses a free AI model to generate articles automatically and stores them in PostgreSQL. This project demonstrates a production-ready deployment workflow with Docker, CodeBuild, and ECR.

---

## Table of Contents

1. [Features](#features)  
2. [Architecture](#architecture)  
3. [Tech Stack](#tech-stack)  
4. [Environment Variables](#environment-variables)  
5. [Local Setup](#local-setup)  
6. [Production Setup](#production-setup)  
7. [AI Article Generation](#ai-article-generation)  
8. [Known Limitations](#known-limitations)  
9. [License](#license)  

---

## Features

- Display a list of blog articles on the frontend.  
- View full content when clicking an article.  
- Automatically generate 1 new article per day using AI.  
- Preloaded with at least 3 articles on first setup.  
- Dockerized frontend and backend for easy deployment.  
- Backend exposes `/articles` and `/health` endpoints.  
- CORS configured to allow frontend to communicate with backend container.  

---

## Architecture


---

## Tech Stack

- **Frontend:** React, Vite, Docker, `serve` for production.  
- **Backend:** Node.js, Express, WebSocket, Docker, PostgreSQL.  
- **AI Model:** OpenRouter – TNG: DeepSeek R1T2 Chimera (Free).  
- **Database:** PostgreSQL (Docker volume for persistence).  
- **Deployment:** AWS EC2, Docker, ECR, CodeBuild.  

---

## Environment Variables

Create a `.env` file in the root project folder (not committed to Git) with the following variables:

HERO_OPENROUTER_API_KEY=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

Also, provided a `.env.example` in the repo for reference (no secrets included).  

---

## Local Setup

1. **Clone the repository**:

    ```bash
    git clone <your-repo-link>
    cd MY-BLOG-PROJECT
    ```

2. **Set up your `.env` file** with the correct values (see `.env.example`).

3. **Run the app with Docker Compose**:

    ```bash
    docker-compose --env-file .env up --build
    ```
---
## Flow of Execution (Docker & App Start)

When running the app with Docker Compose, the startup flow ensures proper initialization of all services and data:

1. **Database starts first**  
   - The PostgreSQL container runs and initializes its data volume.
   
2. **Backend waits for the database**  
   - The backend uses a `wait-for-postgres.sh` script to delay starting until PostgreSQL is fully ready.
   - Once the database is ready, the backend checks if the articles table exists.
   - If missing, the backend generates 3 initial articles using the OpenRouter free AI model (TNG: DeepSeek R1T2 Chimera) and stores them in PostgreSQL.
   - This ensures that the backend always has preloaded articles before serving requests.

3. **Frontend waits for the backend**  
   - The frontend uses a `wait-for-backend.sh` script to wait until the backend is fully running.
   - Once the backend is ready, the frontend connects and fetches the preloaded 3 articles to display immediately.
   - This avoids empty renders or requiring a user refresh to see initial data.

4. **Daily article generation**  
   - The backend has a cron scheduler (default daily) that automatically generates a new article each day.
   - WebSocket is used to instantly update the frontend when a new article is added.

**Result:**  
When the user opens the frontend in the browser, the preloaded articles are already displayed, and new articles will appear automatically without manual refresh.


---
## Notes 

- The backend uses OpenRouter free model TNG: DeepSeek R1T2 Chimera for article generation.
- If the AI returns malformed JSON, fallback articles are provided automatically.
- Cron scheduler is daily by default but can be changed for testing.

---

## This README explains:  

1. **Project purpose & stack**  
2. **Folder structure**  
3. **How to run locally & in production**  
4. **.env usage**  
5. **AI model details & fallback mechanism**  
6. **Limitations**  

---


