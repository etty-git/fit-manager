const express = require("express");
const router = express.Router();

const {
  createInstructor,
  getAllInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor
} = require("../controlers/InstructerControler");

const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

// ================= Routes =================

// admin only
router.post("/", auth, isAdmin, createInstructor);
router.put("/:id", auth, isAdmin, updateInstructor);
router.delete("/:id", auth, isAdmin, deleteInstructor);

// logged in users
router.get("/", auth, getAllInstructors);
router.get("/:id", auth, getInstructorById);

module.exports = router;