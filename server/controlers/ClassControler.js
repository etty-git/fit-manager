const classService = require("../services/classService");

// ================= יצירת כיתה =================
const createClass = async (req, res) => {
  try {
    const lesson = await classService.createClass(req.body);

    res.status(201).json({
      message: "Class created",
      lesson
    });
  } catch (error) {
    res.status(400).json({ error: error.message, message: error.message });
  }
};

// ================= קבלת כיתה =================
const getClass = async (req, res) => {
  try {
    const lesson = await classService.getClass(req.params.id);

    res.json(lesson);

  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// ================= עדכון כיתה =================
const updateClass = async (req, res) => {
  try {
    const lesson = await classService.updateClass(
      req.params.id,
      req.body
    );

    res.json({
      message: "Class updated",
      lesson
    });

  } catch (error) {
    res.status(400).json({ error: error.message, message: error.message });
  }
};

// ================= מחיקה =================
const deleteClass = async (req, res) => {
  try {
    const lesson = await classService.deleteClass(req.params.id);

    res.json({
      message: `Class '${lesson.title}' deleted`
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ================= כל הכיתות =================
const getAllClasses = async (req, res) => {
  try {
    const classes = await classService.getAllClasses();

    res.json(classes);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getClassesByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const classes = await classService.getClassesByUser(userId);

    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createClass,
  getClass,
  updateClass,
  deleteClass,
  getAllClasses,
  getClassesByUser
};
