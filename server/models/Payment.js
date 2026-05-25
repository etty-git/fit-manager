const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    type: {
      type: String,
      enum: ["PLAN", "CLASS"],
      required: true
    },

    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      default: null
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null
    },

    classId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Class", // FIX
  default: null
},

    amount: {
      type: Number,
      required: true,
      min: 1
    },

    

    

    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending"
    },

    paypalOrderId: String,
    paypalCaptureId: String,

    paidAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);