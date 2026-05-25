const paymentService = require("../services/paymentService");
const {finalizePayment } = require("../services/finalizePayment");
const Payment = require("../models/Payment");

// יצירת תשלום
const createPayment = async (req, res) => {
  try {
    const payment = await paymentService.createPaymentRecord({
      userId: req.user.id,
      type: req.body.type,
      planId: req.body.planId,
      classId: req.body.classId,
      bookingId: req.body.bookingId
    });

    res.status(201).json({
      message: "Payment created",
      payment
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// תשלום מדומה + finalize
const pay = async (req, res) => {
  try {
    const paymentId =
      typeof req.body.paymentId === "object"
        ? req.body.paymentId.paymentId
        : req.body.paymentId;

    if (!paymentId) {
      return res.status(400).json({ error: "paymentId is required" });
    }

    const payment = await paymentService.mockPay(paymentId);

    await finalizePayment(payment);

    res.json({
      message: "Payment completed successfully",
      payment
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// שליפת תשלום לפי ID
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("user", "name email")
      .populate("plan")
      .populate("classId")
      .populate("booking");

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    if (
      payment.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(payment);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// כל התשלומים (admin)
const getAllPayments = async (req, res) => {
  const payments = await Payment.find()
    .populate("user", "name email")
    .populate("plan")
    .populate("classId")
    .populate("booking");

  res.json(payments);
};

module.exports = {
  createPayment,
  pay,
  getAllPayments,
  getPaymentById
};