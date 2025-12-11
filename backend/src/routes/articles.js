import express from "express";
import { retrieveDataFromDb } from "../services/articleService.js";

const router = express.Router();

/**
 * GET /articles
 * Returns all articles from the database.
 * Assumes that the database and articles table are already initialized at server startup.
 */
router.get("/", async (req, res) => {
  try {
    const articles = await retrieveDataFromDb();

    if (!articles) {
      console.error("Failed to retrieve articles from the database.");
      return res.status(500).json({ message: "Could not retrieve articles from the database." });
    }

    return res.status(200).json(articles);
  } catch (error) {
    console.error("Error in /articles route:", error);
    return res.sendStatus(500);
  }
});

export default router;


