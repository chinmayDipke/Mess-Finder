// routes/messRoutes.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

// ✅ Get all messes
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM messes");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add a new mess
router.post("/", async (req, res) => {
  const { name, area, price, delivery, menu } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO messes (name, area, price, delivery, menu) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, area, price, delivery, menu]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
