const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    // snapshot של התוכנית בזמן ההזמנה
    planSnapshot: {
      name: String,
      price: Number,
      durationDays: Number
    },

    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true
    },

    pricingType: {
      type: String,
      enum: ["Regular", "Member", "Basic", "Premium", "VIP"],
      default: "Regular"
    },

    classPriceSnapshot: {
      type: Number,
      min: 0,
      required: true
    },

    status: {
      type: String,
      enum: ["Pending", "Booked", "Cancelled", "Completed"],
      default: "Pending"
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending"
    },

    bookingDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Booking", BookingSchema);
