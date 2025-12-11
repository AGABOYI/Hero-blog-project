import pkg from 'pg';
import './config.js'

const { Pool } = pkg;

const pool = new Pool({
  host: "db",
  port: 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB
});

// Test the database connection at startup
pool.connect()
  .then(() => console.log("✅ DB connected successfully"))
  .catch((err) => console.error("❌ DB connection error:", err));

export default pool;
