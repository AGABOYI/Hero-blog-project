import cron from "node-cron";
import { fetchArticlesFromAI } from "./aiClient.js";
import { insertDataToDb } from "./articleService.js";
import { broadcastNewArticle } from "../ws/socketServer.js";

/**
 * Starts a cron job to automatically fetch and insert 1 new article every day.
 * 
 * Cron expression: "0 0 * * *"
 * 
 * Interpretation:
 * - Minute: 0          → Run at minute 0
 * - Hour: 0            → Run at hour 0 (midnight)
 * - Day of Month: *    → Every day of the month
 * - Month: *           → Every month
 * - Day of Week: *     → Every day of the week
 * 
 * Effectively, this runs once per day at 00:00 (midnight).
 * 
 * Notes:
 * - The scheduler does NOT fetch an article immediately when the server starts.
 *   It only runs when the cron expression matches (first execution at the next midnight).
 * - The initial 3 articles should be handled separately when setting up the DB.
 */
export function startArticleScheduler() {
  cron.schedule("0 0 * * *", async () => {
    console.log("Cron Job Triggered: Fetching new daily article...");

    try {
      // Pass 2 to fetchArticlesFromAI to use promptTwo
      // which generates exactly 1 article
      const newArticle = await fetchArticlesFromAI(2);

      if (!newArticle) {
        console.error("Ooops!!!☹️ Failed to fetch article from AI.");
        return;
      }

      // Insert the fetched article into the database
      // insertDataToDb expects an array
      const dbInsertResult = await insertDataToDb(newArticle);

      if (dbInsertResult) {
        console.log("✅🥳 Yeahh!!! New article successfully inserted into DB.");

          // BROADCAST TO ALL CONNECTED WEBSOCKET CLIENTS
        broadcastNewArticle(newArticle);
          // This instantly notifies the UI
      } else {
        console.error(" Failed to insert new article into DB.");
      }

    } catch (error) {
      console.error("Cron Job Error:", error);
    }
  });

  // Inform that the scheduler has been initialized and is now active
  console.log("⏳ Daily article scheduler is active. It will trigger once every 24 hours at midnight.");
}
