import pool from "../db.js";
import { fetchArticlesFromAI } from "./aiClient.js";

/**
 * Checks if the 'articles' table exists in the database.
 * @returns {Promise<boolean>} true if the table exists, false otherwise
 */
export async function isDbSetUp() {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'articles'
      ) AS table_exists;
    `);
    return result.rows[0].table_exists;
  } catch (error) {
    console.error("Error checking DB setup:", error);
    return false;
  }
}

/**
 * Creates the 'articles' table (if not exists) and inserts initial 3 articles fetched from AI.
 * Returns the inserted articles for immediate use (e.g., broadcasting to clients).
 * @returns {Promise<Array|null>} Array of inserted articles, or null if failed
 */
export async function setupDb() {
  try {
    await pool.query(`
      CREATE TABLE articles (
        id SERIAL PRIMARY KEY,
        title TEXT,
        content TEXT,
        author TEXT,
        date DATE
      );
    `);

    // Fetch initial 3 articles from AI
    const articles = await fetchArticlesFromAI(1);
    if (!articles) return null;

    // Insert into DB and return inserted rows
    const inserted = await insertDataToDb(articles);
    return inserted;
  } catch (error) {
    console.error("Error setting up DB:", error);
    return null;
  }
}

/**
 * Inserts an array of article objects into the database.
 * @param {Array} data Array of article objects
 * @returns {Promise<Array|null>} Inserted rows or null if failed
 */
export async function insertDataToDb(data) {
  try {
    // Add today's date to each article
    data.forEach(obj => {
      obj.date = new Date().toISOString().split("T")[0];
    });

    const insertedRows = [];

    for (const article of data) {
      const result = await pool.query(
        `INSERT INTO articles (title, content, author, date) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [article.title, article.content, article.author, article.date]
      );
      insertedRows.push(result.rows[0]);
    }

    return insertedRows;
  } catch (error) {
    console.error("Failed to insert data:", error);
    return null;
  }
}

/**
 * Retrieves all articles from the database.
 * Used by the /articles route.
 * @returns {Promise<Array|false>} Array of articles or false if failed
 */
export async function retrieveDataFromDb() {
  try {
    const result = await pool.query(`SELECT * FROM articles ORDER BY id ASC`);
    return result.rows;
  } catch (error) {
    console.error("Error fetching data from DB:", error);
    return false;
  }
}

