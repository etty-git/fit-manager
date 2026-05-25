const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["Basic", "Premium", "VIP"],
      required: true,
      unique: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    durationDays: {
      type: Number,
      required: true,
      min: 1
    },
isActive: {
  type: Boolean,
  default: true
},
features: {
  type: [String],
  default: []
},
    description: {
      type: String,
      default: "",
      trim:true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Plan", PlanSchema);