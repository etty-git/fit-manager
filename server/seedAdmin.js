require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const defaultAdmin = {
  name: process.env.ADMIN_NAME || "FitManager Admin",
  username: process.env.ADMIN_USERNAME || "admin",
  email: process.env.ADMIN_EMAIL || "admin@gmail.com",
  phone: process.env.ADMIN_PHONE || "0500000000",
  password: process.env.ADMIN_PASSWORD || "123456"
};

const createDefaultAdmin = async () => {
  const existingAdmin = await User.findOne({
    $or: [
      { role: "admin" },
      { email: defaultAdmin.email.toLowerCase() },
      { username: defaultAdmin.username }
    ]
  });

  if (existingAdmin) {
    console.log("Default admin already exists");
    return existingAdmin;
  }

  const hashedPassword = await bcrypt.hash(defaultAdmin.password, 10);

  const admin = await User.create({
    name: defaultAdmin.name,
    username: defaultAdmin.username,
    email: defaultAdmin.email.toLowerCase(),
    phone: defaultAdmin.phone,
    password: hashedPassword,
    role: "admin",
    membershipStatus: "Active"
  });

  console.log(`Default admin created: ${admin.email}`);
  return admin;
};

const runSeed = async () => {
  try {
    const mongoUri = process.env.datauli || process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("Missing Mongo connection string. Set datauli or MONGO_URI in .env");
    }

    await mongoose.connect(mongoUri);
    await createDefaultAdmin();
  } catch (err) {
    console.error("SEED ERROR:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

if (require.main === module) {
  runSeed();
}

module.exports = {
  createDefaultAdmin
};
