const Class = require("../models/Class");
const Instructor = require("../models/Instructor");
const Booking = require("../models/Booking");
const User = require("../models/User");

const toNumberOrUndefined = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  return Number(value);
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildMemberPrices = (data, existingPrices = {}) => {
  const basic =
    toNumberOrUndefined(data.basicPrice) ??
    toNumberOrUndefined(data.memberPrices?.basic) ??
    toNumberOrUndefined(data.price) ??
    existingPrices.basic;

  const premium =
    toNumberOrUndefined(data.premiumPrice) ??
    toNumberOrUndefined(data.memberPrices?.premium) ??
    toNumberOrUndefined(data.memberPrice) ??
    existingPrices.premium ??
    basic;

  const vip =
    toNumberOrUndefined(data.vipPrice) ??
    toNumberOrUndefined(data.memberPrices?.vip) ??
    existingPrices.vip ??
    premium;

  return { basic, premium, vip };
};

const findInstructorByName = async (name) => {
  const normalizedName = String(name || "").trim();
  if (!normalizedName) return null;

  const user = await User.findOne({
    name: new RegExp(`^${escapeRegex(normalizedName)}$`, "i"),
    role: "instructor"
  });

  if (!user) return null;

  return Instructor.findOne({ user: user._id });
};

const resolveInstructor = async ({ instructor, instructorName }) => {
  if (instructorName) {
    const foundByName = await findInstructorByName(instructorName);
    if (!foundByName) {
      throw new Error("Instructor not found");
    }

    return foundByName._id;
  }

  if (instructor) {
    const exists = await Instructor.findById(instructor);
    if (!exists) {
      throw new Error("Instructor not found");
    }

    return exists._id;
  }

  throw new Error("Instructor is required");
};

// ================= Create Class =================
const createClass = async (data) => {
  const { title, description, capacity, duration, schedule } = data;

  if (!title || !schedule || !capacity || !duration) {
    throw new Error("Missing required fields");
  }

  const instructorId = await resolveInstructor(data);
  const memberPrices = buildMemberPrices(data);

  if (
    memberPrices.basic === undefined ||
    memberPrices.premium === undefined ||
    memberPrices.vip === undefined
  ) {
    throw new Error("All plan prices are required");
  }

  const duplicate = await Class.findOne({
    instructor: instructorId,
    schedule
  });

  if (duplicate) {
    throw new Error("Class already exists at this time");
  }

  const lesson = await Class.create({
    title,
    description,
    instructor: instructorId,
    capacity,
    duration,
    schedule,
    price: memberPrices.basic,
    memberPrices,
    enrolledUsers: [],
    currentCapacity: 0,
    status: "Open"
  });

  return lesson;
};

// ================= Get Class =================
const getClass = async (id) => {
  const lesson = await Class.findById(id).populate({
    path: "instructor",
    populate: { path: "user", select: "name email phone" }
  });

  if (!lesson) {
    throw new Error("Class not found");
  }

  return lesson;
};

// ================= Update Class =================
const updateClass = async (id, data) => {
  const lesson = await Class.findById(id);

  if (!lesson) {
    throw new Error("Class not found");
  }

  if (
    lesson.enrolledUsers &&
    lesson.enrolledUsers.length > 0 &&
    (data.instructor || data.instructorName)
  ) {
    throw new Error("Cannot change instructor after bookings");
  }

  if (data.instructor || data.instructorName) {
    lesson.instructor = await resolveInstructor(data);
  }

  const allowedFields = [
    "title",
    "description",
    "capacity",
    "duration",
    "schedule"
  ];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      lesson[field] = data[field];
    }
  });

  const hasPriceUpdate = [
    "basicPrice",
    "premiumPrice",
    "vipPrice",
    "memberPrices",
    "price",
    "memberPrice"
  ].some((field) => data[field] !== undefined);

  if (hasPriceUpdate) {
    const memberPrices = buildMemberPrices(data, lesson.memberPrices || {});

    if (
      memberPrices.basic === undefined ||
      memberPrices.premium === undefined ||
      memberPrices.vip === undefined
    ) {
      throw new Error("All plan prices are required");
    }

    lesson.memberPrices = memberPrices;
    lesson.price = memberPrices.basic;
  }

  if (lesson.currentCapacity >= lesson.capacity) {
    lesson.status = "Full";
  } else {
    lesson.status = "Open";
  }

  await lesson.save();

  return lesson;
};

// ================= Delete Class =================
const deleteClass = async (id) => {
  const lesson = await Class.findById(id);

  if (!lesson) {
    throw new Error("Class not found");
  }

  await Booking.updateMany(
    { classId: id, status: { $in: ["Pending", "Booked"] } },
    { status: "Cancelled" }
  );

  await Class.findByIdAndDelete(id);

  return lesson;
};

// ================= Get All Classes =================
const getAllClasses = async () => {
  return await Class.find().populate({
    path: "instructor",
    populate: { path: "user", select: "name email phone" }
  });
};

// ================= Get Classes By User =================
const getClassesByUser = async (userId) => {
  return await Class.find({
    enrolledUsers: userId
  }).populate({
    path: "instructor",
    populate: { path: "user", select: "name email phone" }
  });
};

module.exports = {
  createClass,
  getClass,
  updateClass,
  deleteClass,
  getAllClasses,
  getClassesByUser
};
