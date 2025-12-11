import express from "express";
import http from "http"; 
import cors from "cors";
import articlesRoutes from "./routes/articles.js";
import pool from "./db.js";
import { isDbSetUp, setupDb, retrieveDataFromDb } from "./services/articleService.js";
import { startArticleScheduler } from "./services/articleJob.js";
import { initWebSocketServer } from "./ws/socketServer.js";
import healthRouter, { setDbReady } from "./routes/health.js";

const app = express();
const port = 8080;

const server = http.createServer(app);

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/articles", articlesRoutes);
// Mount the health route , 
app.use("/health", healthRouter);

initWebSocketServer(server);

async function initializeDatabase() {
  console.log("🔍 Checking database...");

  const tableExists = await isDbSetUp();

  if (!tableExists) {
    console.log("📄 Table missing — creating it and inserting initial articles...");

    console.log("Please wait...")
    const initialArticles = await setupDb();

    if (!initialArticles || initialArticles.length === 0) {
      console.error("❌ Initial article setup failed. Stopping server.");
      process.exit(1);
    }

    console.log("✅ Initial articles inserted successfully.");
  } else {
    console.log("📄 Table already exists — skipping insertion.");
  }

  // Sanity check
  const articles = await retrieveDataFromDb();
  if (!articles || articles.length === 0) {
    console.error("❌ DB empty after setup. Refusing to start.");
    process.exit(1);
  }

  console.log(`📚 DB ready with ${articles.length} articles.`);
}

server.listen(port, async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ DB connection successful");
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  }

  await initializeDatabase();
  setDbReady(true); //  mark backend as ready
  console.log(`🚀 Server running on port ${port}`);

  startArticleScheduler();
});
