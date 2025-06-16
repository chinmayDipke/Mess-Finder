const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");
const pool = require("../db"); // assuming you're using pg-pool
const multer = require("multer");
const path = require("path");

// Storage config for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Make sure the 'uploads/' directory exists
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  },
});

const upload = multer({ storage });

// UPDATE mess details
router.put("/update/:id", authenticateUser, async (req, res) => {
  const messId = req.params.id;
  const { menu, location, delivery } = req.body;

  try {
    const result = await pool.query(
      `UPDATE messes
       SET menu = $1, location = $2, delivery = $3
       WHERE id = $4 AND owner_id = $5
       RETURNING *`,
      [menu, location, delivery, messId, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ error: "Unauthorized or mess not found" });
    }

    res.json({ message: "Mess updated successfully", mess: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/mess/upload-image
router.post(
  "/upload-image",
  authenticateUser,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imagePath = req.file.path; // E.g., uploads/172345-photo.jpg
    res
      .status(200)
      .json({ message: "Image uploaded successfully", path: imagePath });
  }
);

module.exports = router;
