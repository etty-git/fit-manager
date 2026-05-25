const Users = require("../models/User");
const Payment = require("../models/Payment");
const Class = require("../models/Class");
const Booking = require("../models/Booking");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// =================== Create Admin ===================
const createAdmin = async (req, res) => {
  try {
    const { name, username, email, phone, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // בדיקה אם כבר קיים משתמש
    const existingUser = await Users.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // הצפנת סיסמה
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Users.create({
      name,
      username,
      email,
      phone,
      password: hashedPassword,
      role: "admin",
      membershipType: "VIP",
      membershipStatus: "Active"
    });

    // יצירת token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const adminObj = admin.toObject();
    delete adminObj.password;

    return res.status(201).json({
      message: "Admin created successfully",
      user: adminObj,
      token
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const user = await Users.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [users, payments, classes, bookings] = await Promise.all([
      Users.find({ isDeleted: { $ne: true } }).select("role membershipStatus"),
      Payment.find({ status: "Paid" })
        .populate({
          path: "classId",
          select: "title instructor",
          populate: {
            path: "instructor",
            populate: { path: "user", select: "name" }
          }
        }),
      Class.find().populate({
        path: "instructor",
        populate: { path: "user", select: "name" }
      }),
      Booking.find({ status: { $in: ["Booked", "Completed"] } }).populate("classId", "title")
    ]);

    const revenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const classRevenue = payments
      .filter((payment) => payment.type === "CLASS")
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const planRevenue = payments
      .filter((payment) => payment.type === "PLAN")
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);

    const revenueByMonthMap = {};
    payments.forEach((payment) => {
      const date = payment.paidAt || payment.createdAt;
      const key = new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "2-digit"
      }).format(date);
      revenueByMonthMap[key] = (revenueByMonthMap[key] || 0) + payment.amount;
    });

    const instructorRevenueMap = {};
    payments
      .filter((payment) => payment.type === "CLASS" && payment.classId?.instructor)
      .forEach((payment) => {
        const instructorName = payment.classId.instructor?.user?.name || "Unknown";
        instructorRevenueMap[instructorName] =
          (instructorRevenueMap[instructorName] || 0) + payment.amount;
      });

    const popularityMap = {};
    bookings.forEach((booking) => {
      const title = booking.classId?.title || "Unknown class";
      popularityMap[title] = (popularityMap[title] || 0) + 1;
    });

    res.json({
      totals: {
        members: users.filter((user) => user.role === "member").length,
        instructors: users.filter((user) => user.role === "instructor").length,
        activeMembers: users.filter((user) => user.membershipStatus === "Active").length,
        classes: classes.length,
        bookings: bookings.length,
        revenue,
        classRevenue,
        planRevenue
      },
      revenueByMonth: Object.entries(revenueByMonthMap).map(([label, value]) => ({
        label,
        value
      })),
      revenueByType: [
        { label: "Plans", value: planRevenue },
        { label: "Classes", value: classRevenue }
      ],
      instructorRevenue: Object.entries(instructorRevenueMap)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value),
      popularClasses: Object.entries(popularityMap)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5),
      classCapacity: classes.map((lesson) => ({
        label: lesson.title,
        value: lesson.currentCapacity || 0,
        capacity: lesson.capacity || 0
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createAdmin,
  getAllUsers,
  deleteUser,
  getDashboardStats
};
