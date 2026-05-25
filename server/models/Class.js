const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },

    description: { type: String, default: "", trim: true },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: true
    },

    schedule: { type: Date, required: true },

    duration: { type: Number, min: 1, required: true },

    capacity: { type: Number, min: 1, required: true },

    // ✅ FIX חשוב
    currentCapacity: { type: Number, default: 0 },

    enrolledUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    status: {
      type: String,
      enum: ["Open", "Full", "Cancelled"],
      default: "Open"
    },

    price: { type: Number, min: 0, required: true },
    memberPrices: {
      basic: { type: Number, min: 0 },
      premium: { type: Number, min: 0 },
      vip: { type: Number, min: 0 }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", ClassSchema);
