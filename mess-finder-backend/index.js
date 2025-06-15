import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import messRoutes from "./routes/messRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); // allow JSON request bodies

app.use("/messes", messRoutes); // API for mess routes

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`Database connected: ${new Date(result.rows[0].now).toString()}`);
  } catch (error) {
    res.status(500).send(`Error connecting to DB: ${error.message}`);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
