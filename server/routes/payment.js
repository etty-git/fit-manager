const express = require("express");
const router = express.Router();

const {
  createPayment,
  getAllPayments,
  getPaymentById,
  pay
} = require("../controlers/PaymentController");

const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

// יצירת תשלום
router.post("/", auth, createPayment);
// 💳 תשלום מדומה
router.post("/pay", auth, pay);
router.get("/:id", auth, getPaymentById);
// admin
router.get("/", auth, isAdmin, getAllPayments);
module.exports = router;