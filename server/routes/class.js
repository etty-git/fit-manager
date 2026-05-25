const express = require("express");
const router = express.Router();

const {
  createClass,
  getClass,
  updateClass,
  deleteClass,
  getAllClasses,
  getClassesByUser
} = require("../controlers/ClassControler");

const authMiddleware = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");


// ================= Routes =================

router.get("/my", authMiddleware, getClassesByUser);
// יצירת כיתה – רק admin
router.post("/", authMiddleware, isAdmin, createClass);

// עדכון כיתה – רק admin
router.put("/:id", authMiddleware, isAdmin, updateClass);


// מחיקת כיתה – רק admin
router.delete("/:id", authMiddleware, isAdmin, deleteClass);

// קבלת כל הכיתות – משתמש מחובר
router.get("/", getAllClasses);


// קבלת כיתה לפי ID
router.get("/:id", getClass);



module.exports = router;
