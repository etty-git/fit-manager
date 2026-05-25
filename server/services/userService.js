const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Instructor = require("../models/Instructor");
// ================= Create User =================
const createUser = async (data) => {
  const { name, username, email, phone, password, planId } = data;

  if (!name || !username || !email || !phone || !password) {
    throw new Error("Missing required fields");
  }

  const exists = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (exists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    username,
    email,
    phone,
    password: hashedPassword,
    planId: planId || null,
    role: "member"
  });

  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

// ================= Login =================
const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).populate("planId");

  if (!user) throw new Error("Invalid email or password");

  if (!user.password) {
    throw new Error("Please login with Google");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const { password: _, ...userData } = user._doc;

  return { user: userData, token };
};

// ================= Get Profile =================
const getUserById = async (id) => {
  const user = await User.findById(id).populate("planId");

  if (!user) {
    throw new Error("User not found");
  }

  const { password, ...safeUser } = user._doc;

  return safeUser;
};

// ================= Update User =================
const updateUser = async (id, data, requester) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  // בדיקת הרשאה (משתמש יכול לעדכן רק את עצמו או admin)
  if (requester.role !== "admin" && requester.id !== id) {
    throw new Error("Not authorized");
  }

  const { name, username, email, phone, password, planId, role } = data;

  // מניעת כפילות
  if (email || username) {
    const exists = await User.findOne({
      _id: { $ne: id },
      $or: [{ email }, { username }]
    });

    if (exists) {
      throw new Error("Email or username already taken");
    }
  }

  if (name) user.name = name;
  if (username) user.username = username;
  if (email) user.email = email;
  if (phone) user.phone = phone;

  // רק admin יכול לשנות role
  if (role && requester.role === "admin") {
    user.role = role;
  }

  if (planId) {
    user.planId = planId;
  }

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();

  const { password: _, ...safeUser } = user.toObject();

  return safeUser;
};

// ================= Delete User =================

const deleteUser = async (id, requester) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  // ================= AUTH =================
  const isAdmin = requester.role === "admin";
  const isSelf = requester.id.toString() === id.toString();

  if (!isAdmin && !isSelf) {
    throw new Error("Not authorized");
  }

  // ================= SOFT DELETE =================
  user.isDeleted = true;
  user.deletedAt = new Date();
  user.status = "Inactive"; // אם יש לך שדה כזה (מומלץ)

  await user.save();

  // ================= CLEAN RELATED DATA =================

  // ביטול בוקינגים פעילים
  await Booking.updateMany(
    { member: id, status: "Booked" },
    { status: "Cancelled" }
  );

  // סימון תשלומים (לא מוחקים!)
  await Payment.updateMany(
    { user: id },
    { status: "Refunded" } // או "Cancelled" לפי ההיגיון שלך
  );

  // הסרת מדריך אם קיים
  await Instructor.deleteOne({ user: id });

  return {
    success: true,
    message: "User soft deleted successfully"
  };
};
module.exports = {
  createUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser
};
