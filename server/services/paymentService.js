const Payment = require("../models/Payment");
const Plan = require("../models/Plans");
const Class = require("../models/Class");
const Booking = require("../models/Booking");

// יצירת תשלום
const createPaymentRecord = async ({ userId, type, planId, classId, bookingId }) => {
  let amount = 0;

  if (type === "PLAN") {
    const plan = await Plan.findById(planId);
    if (!plan) throw new Error("Plan not found");
    amount = plan.price;
  }

  if (type === "CLASS") {
    if (!bookingId) throw new Error("Booking is required for class payment");

    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error("Booking not found");

    const gymClass = await Class.findById(classId);
    if (!gymClass) throw new Error("Class not found");
    amount = booking.classPriceSnapshot ?? gymClass.price;
  }

  const payment = await Payment.create({
    user: userId,
    type,
    plan: type === "PLAN" ? planId : null,
    classId: type === "CLASS" ? classId : null,
    booking: bookingId || null,
    amount,
    status: "Pending"
  });

  return payment;
};

// תשלום מדומה
const mockPay = async (paymentId) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) throw new Error("Payment not found");

  if (payment.status === "Paid") return payment;

  payment.status = "Paid";
  payment.paidAt = new Date();

  await payment.save();

  return payment;
};

module.exports = {
  createPaymentRecord,
  mockPay
};
