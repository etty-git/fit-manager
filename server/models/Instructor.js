const mongoose = require("mongoose");

const InstructorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    specialty: {
      type: String,
      required: true,
      trim: true
    },
bio: {
  type: String,
  trim: true,
  default: ""
},
rating: {
  type: Number,
  min: 0,
  max: 5,
  default: 0
},
    experienceYears: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Instructor", InstructorSchema);