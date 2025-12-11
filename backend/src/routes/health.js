import express from "express";

const router = express.Router();

// This will be updated by index.js when DB is ready
let dbReady = false;

// GET /health → returns status of backend
router.get("/", (req, res) => {
  if (dbReady) {
    res.status(200).send("OK");
  } else {
    res.status(503).send("Not ready");
  }
});

// Helper function for index.js to set readiness
export function setDbReady(status) {
  dbReady = status;
}

export default router;
