const Instructor = require("../models/Instructor");
const User = require("../models/User");
const bcrypt = require("bcrypt");
// ================= Create Instructor =================
const createInstructor = async (data) => {
  const {
    specialty,
    bio,
    experienceYears,
    name,
    username,
    email,
    phone,
    password
  } = data;

  // בדיקה בסיסית
  if (!email || !password || !specialty) {
    const err = new Error("Missing required fields");
     alert("Missing required fields");
    err.status = 400;
    throw err;
  }

  // בדיקה אם המשתמש כבר קיים
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const err = new Error("User already exists");
    err.status = 409;
    throw err;
  }

  // 🔥 HASH לסיסמה
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // יצירת User עם סיסמה מוצפנת
  const user = await User.create({
    name,
    username,
    email,
    phone,
    password: hashedPassword,
    role: "instructor"
  });

  // יצירת Instructor
  const instructor = await Instructor.create({
    user: user._id,
    specialty,
    bio,
    experienceYears
  });

  await instructor.populate("user", "name email phone role");

  return instructor;
};
// ================= קבלת כל המדריכים =================
// ================= Get All =================
const getAllInstructors = async () => {
  return await Instructor.find().populate("user", "name email phone role");
};

// ================= קבלת מדריך =================
// ================= Get By ID =================
const getInstructorById = async (id) => {
  const instructor = await Instructor.findById(id).populate(
    "user",
    "name email phone role"
  );

  if (!instructor) {
    throw new Error("Instructor not found");
  }

  return instructor;
};

// ================= עדכון מדריך =================
// ================= Update =================
const updateInstructor = async (id, data) => {
  const instructor = await Instructor.findById(id);

  if (!instructor) {
    throw new Error("Instructor not found");
  }

  const { specialty, bio, experienceYears } = data;

  if (specialty) instructor.specialty = specialty;
  if (bio !== undefined) instructor.bio = bio;
  if (experienceYears !== undefined) {
    instructor.experienceYears = experienceYears;
  }

  await instructor.save();

  await instructor.populate("user", "name email phone role");

  return instructor;
};

// ================= מחיקת מדריך =================
// ================= Delete =================
const deleteInstructor = async (id) => {
  const instructor = await Instructor.findById(id);

  if (!instructor) {
    throw new Error("Instructor not found");
  }

  // 🔥 החזרת user חזרה ל-member
  const user = await User.findById(instructor.user);
  if (user) {
    user.role = "member";
    await user.save();
  }

  await Instructor.findByIdAndDelete(id);

  return true;
};

module.exports = {
  createInstructor,
  getAllInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor
};