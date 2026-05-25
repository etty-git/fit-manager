const express = require('express');
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  cancelBooking
} = require('../controlers/bookingControler');

const authMiddleware = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');


// ================= Routes =================

// יצירת הזמנה
router.post('/', authMiddleware, createBooking);

// הזמנות של המשתמש המחובר
router.get('/my', authMiddleware, getMyBookings);

router.patch("/cancel/:id",authMiddleware,cancelBooking);
// קבלת הזמנה לפי ID
router.get('/:id', authMiddleware, getBookingById);

// עדכון הזמנה
router.put('/:id', authMiddleware, isAdmin, updateBooking);

// מחיקת הזמנה – רק admin
router.delete('/:id', authMiddleware, isAdmin, deleteBooking);

module.exports = router;