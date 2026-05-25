const Booking = require("../models/Booking");
const Class = require("../models/Class");
const User = require("../models/User");

const getPlanPriceKey = (planName) => {
  const normalized = String(planName || "Basic").toLowerCase();
  if (normalized === "vip") return "vip";
  if (normalized === "premium") return "premium";
  return "basic";
};

const getClassPriceForUser = (gymClass, user, hasActiveMembership) => {
  const prices = gymClass.memberPrices || {};
  if (!hasActiveMembership) {
    return prices.basic ?? gymClass.price;
  }

  const key = getPlanPriceKey(user.planId?.name);
  return prices[key] ?? prices.basic ?? gymClass.price;
};

// ================= CREATE BOOKING =================
const createBookingService = async (userId, classId) => {
  const gymClass = await Class.findById(classId);
  if (!gymClass) throw new Error("Class not found");

  const user = await User.findById(userId).populate("planId");
  if (!user) throw new Error("User not found");

  if (user.membershipEnd && user.membershipEnd < new Date()) {
    user.membershipStatus = "Expired";
    await user.save();
  }

  if (gymClass.status === "Cancelled") {
    throw new Error("Class is cancelled");
  }

  if (new Date(gymClass.schedule) < new Date()) {
    throw new Error("Class already started");
  }

  const existingBooking = await Booking.findOne({
    member: userId,
    classId,
    status: { $in: ["Pending", "Booked"] }
  });

  if (existingBooking) {
    if (existingBooking.status === "Pending") {
      return existingBooking;
    }

    throw new Error("Already booked this class");
  }

  if (gymClass.currentCapacity >= gymClass.capacity) {
    throw new Error("Class is full");
  }

  const hasActiveMembership =
    Boolean(user.planId) &&
    user.membershipStatus === "Active" &&
    (!user.membershipEnd || new Date(user.membershipEnd) > new Date());

  const classPriceSnapshot = getClassPriceForUser(
    gymClass,
    user,
    hasActiveMembership
  );

  const booking = await Booking.create({
    member: userId,
    classId,
    status: "Pending",
    paymentStatus: "Pending",
    pricingType: hasActiveMembership ? user.planId.name : "Regular",
    classPriceSnapshot,
    planSnapshot: user.planId
      ? {
          name: user.planId.name,
          price: user.planId.price,
          durationDays: user.planId.durationDays
        }
      : undefined
  });

  return booking;
};

module.exports = {
  createBookingService
};
