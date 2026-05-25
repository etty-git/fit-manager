const instructorService = require("../services/instructorService");

// ================= Create =================
const createInstructor = async (req, res) => {
  try {
    const instructor = await instructorService.createInstructor(req.body);

    res.status(201).json({
      message: "Instructor created",
      instructor
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// ================= כל המדריכים =================
const getAllInstructors = async (req, res) => {
  try {
    const instructors = await instructorService.getAllInstructors();
    res.json(instructors);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= לפי ID =================
const getInstructorById = async (req, res) => {
  try {
    const instructor = await instructorService.getInstructorById(req.params.id);
    res.json(instructor);

  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// ================= עדכון =================
const updateInstructor = async (req, res) => {
  try {
    const instructor = await instructorService.updateInstructor(
      req.params.id,
      req.body
    );

    res.json({
      message: "Instructor updated",
      instructor
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ================= מחיקה =================
const deleteInstructor = async (req, res) => {
  try {
    await instructorService.deleteInstructor(req.params.id);

    res.json({
      message: "Instructor deleted successfully"
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createInstructor,
  getAllInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor
};