const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateUser = require("../middleware/authMiddleware");

// Add a new mess
router.post("/add", authenticateUser, async (req, res) => {
  const { name, area, price, delivery, menu, image_url } = req.body;

  // Basic validation
  if (!name || !area || !price || !delivery || !menu || !image_url) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO messes (name, area, price, delivery, menu, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, area, price, delivery, menu, image_url]
    );

    res.status(201).json({
      message: "Mess added successfully",
      mess: result.rows[0],
    });
  } catch (error) {
    console.error("Database insert error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
