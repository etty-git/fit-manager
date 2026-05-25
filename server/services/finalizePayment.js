const User = require("../models/User");
const Plan = require("../models/Plans");
const Booking = require("../models/Booking");
const Class = require("../models/Class");

const finalizePayment = async (payment) => {
  // ===== PLAN =====
  console.log("FINALIZE TYPE:", payment.type);
  if (payment.type === "PLAN") {
    const user = await User.findById(payment.user);
    const plan = await Plan.findById(payment.plan);

    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + plan.durationDays);

    user.planId = plan._id;
    user.membershipStatus = "Active";
    user.membershipStart = start;
    user.membershipEnd = end;

    await user.save();
  }

  // ===== CLASS =====
  if (payment.type === "CLASS") {
    if (!payment.booking) {
      throw new Error("Booking missing - must create booking before payment");
    }

    const booking = await Booking.findById(payment.booking);
    const gymClass = await Class.findById(payment.classId);

    const wasBooked = booking?.status === "Booked";

    if (!booking || !gymClass) {
      throw new Error("Class booking was not found");
    }

    if (!wasBooked && gymClass.currentCapacity >= gymClass.capacity) {
      booking.status = "Cancelled";
      booking.paymentStatus = "Failed";
      await booking.save();
      throw new Error("Class is full");
    }

    if (booking) {
      booking.paymentStatus = "Paid";
      booking.status = "Booked";
      await booking.save();
    }

    if (!wasBooked) {
      const alreadyEnrolled = gymClass.enrolledUsers.some(
        (userId) => userId.toString() === payment.user.toString()
      );

      if (!alreadyEnrolled) {
        gymClass.enrolledUsers.push(payment.user);
        gymClass.currentCapacity += 1;
      }

      gymClass.status =
        gymClass.currentCapacity >= gymClass.capacity
          ? "Full"
          : "Open";

      await gymClass.save();
    }
  }
};

module.exports = { finalizePayment };
