const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.datauli || process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("Missing Mongo connection string. Set datauli or MONGO_URI in .env");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("DB connection error", err);
    process.exit(1);
  }
};

module.exports = connectDB;
