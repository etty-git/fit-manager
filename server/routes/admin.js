const express = require("express");
const router = express.Router();

const { createAdmin, getDashboardStats } = require("../controlers/AdminController");

const authMiddleware = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

// ================= CREATE ADMIN =================
// רק אדמין יכול ליצור אדמין חדש
router.post("/", authMiddleware, isAdmin, createAdmin);
router.get("/stats", authMiddleware, isAdmin, getDashboardStats);

module.exports = router;
