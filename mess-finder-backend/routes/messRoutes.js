const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateUser = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// GET all messes (public)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM messes ORDER BY id ASC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching messes:", error.message);
    res.status(500).json({ error: "Failed to fetch mess data" });
  }
});

// Public route to get all messes with selected fields
router.get("/all", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, area, price, delivery, menu, image_url FROM messes"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching messes:", error.message);
    res.status(500).json({ error: "Failed to fetch messes" });
  }
});

// GET mess by ID (public)
router.get("/:id", async (req, res) => {
  const messId = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM messes WHERE id = $1", [
      messId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mess not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching mess:", error.message);
    res.status(500).json({ error: "Failed to fetch mess data" });
  }
});

// POST add a new mess (protected)
router.post(
  "/add",
  authenticateUser,
  upload.single("image"),
  async (req, res) => {
    const { name, area, price, delivery, menu } = req.body;
    const ownerId = req.user.id;

    if (!name || !area || !price || !menu || !req.file) {
      return res
        .status(400)
        .json({ error: "All fields and image are required" });
    }

    const image_url = `/uploads/${req.file.filename}`;
    const menuArray = menu.split(",").map((item) => item.trim());

    try {
      const result = await pool.query(
        `INSERT INTO messes (name, area, price, delivery, menu, image_url, owner_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [name, area, price, delivery === "true", menuArray, image_url, ownerId]
      );

      res.status(201).json({
        message: "Mess added successfully",
        mess: result.rows[0],
      });
    } catch (error) {
      console.error("Error adding mess with image:", error.message);
      res.status(500).json({ error: "Failed to add mess with image" });
    }
  }
);

// Protected route to add mess with image (alternative upload route)
router.post(
  "/upload",
  authenticateUser,
  upload.single("image"),
  async (req, res) => {
    const { name, area, price, delivery, menu } = req.body;
    const ownerId = req.user.id;

    if (!name || !area || !price || !delivery || !menu || !req.file) {
      return res
        .status(400)
        .json({ error: "All fields and image are required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const menuArray = menu.split(",").map((item) => item.trim());

    try {
      const result = await pool.query(
        "INSERT INTO messes (name, area, price, delivery, menu, image_url, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [name, area, price, delivery === "true", menuArray, imageUrl, ownerId]
      );

      res
        .status(201)
        .json({ message: "Mess uploaded successfully", mess: result.rows[0] });
    } catch (err) {
      console.error("Error uploading mess:", err.message);
      res.status(500).json({ error: "Failed to add mess with image" });
    }
  }
);

// PUT update mess by ID (protected)
router.put(
  "/:id",
  authenticateUser,
  upload.single("image"),
  async (req, res) => {
    const messId = req.params.id;
    const { name, area, price, delivery, menu } = req.body;
    let image_url = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      // If no new image is uploaded, keep the old image_url
      if (!image_url) {
        const result = await pool.query(
          "SELECT image_url FROM messes WHERE id = $1",
          [messId]
        );
        image_url = result.rows[0]?.image_url || null;
      }

      const menuArray = menu
        ? menu.split(",").map((item) => item.trim())
        : null;

      const result = await pool.query(
        `UPDATE messes SET 
        name = $1, 
        area = $2, 
        price = $3, 
        delivery = $4, 
        menu = $5, 
        image_url = $6 
      WHERE id = $7 RETURNING *`,
        [name, area, price, delivery === "true", menuArray, image_url, messId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Mess not found" });
      }

      res.status(200).json({
        message: "Mess updated successfully",
        mess: result.rows[0],
      });
    } catch (error) {
      console.error("Update error:", error.message);
      res.status(500).json({ error: "Failed to update mess" });
    }
  }
);

// Get messes by owner (protected route)
router.get("/owner/messes", authenticateUser, async (req, res) => {
  const ownerId = req.user.id;
  try {
    const result = await pool.query(
      "SELECT * FROM messes WHERE owner_id = $1 ORDER BY id DESC",
      [ownerId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching owner's messes:", error.message);
    res.status(500).json({ error: "Failed to fetch your messes" });
  }
});

module.exports = router;
