const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const authenticateUser = require("../middleware/authMiddleware");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

router.post("/register", async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!["owner", "admin"].includes(role)) {
    return res
      .status(400)
      .json({ error: "Invalid role. Must be 'owner' or 'admin'" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [name, email, hashedPassword, phone, role]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.rows[0].id,
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already exists" });
    }
    res
      .status(500)
      .json({ error: "Registration failed", details: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // 1. Check if user exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" }); // Use 401 for security
    }

    const user = result.rows[0];

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" }); // Use 401 for security
    }

    // 3. Generate JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ error: "Server error during login" });
  }
});

module.exports = router;
