const { createBookingService } = require("../services/bookingService");
const Booking = require("../models/Booking");
const Class = require("../models/Class");

// ================= CREATE =================
const createBooking = async (req, res) => {
  try {
    const booking = await createBookingService(
      req.user.id,
      req.body.classId
    );

    res.status(201).json({
      message: "Booking created",
      booking
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ================= MY BOOKINGS =================
const getMyBookings = async (req, res) => {
  try {
   const bookings = await Booking.find({
    member: req.user.id,
    status: { $in: ["Booked", "Cancelled", "Completed"] }
   })
  .populate({
    path: "classId",
    populate: {
      path: "instructor",
      populate: {
        path: "user",
        select: "name"
      }
    }
  });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= BY ID =================
const getBookingById = async (req, res) => {
  try {
   const booking = await Booking.findById(req.params.id)
  .populate({
    path: "classId",
    populate: {
      path: "instructor",
      populate: {
        path: "user",
        select: "name"
      }
    }
  });

    if (!booking) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ================= CANCEL (חשוב!) =================
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Not found" });

    if (booking.status === "Cancelled") {
      return res.status(400).json({ message: "Already cancelled" });
    }

    booking.status = "Cancelled";
    await booking.save();

    const gymClass = await Class.findById(booking.classId);

    if (gymClass) {
      gymClass.enrolledUsers = gymClass.enrolledUsers.filter(
        (u) => u.toString() !== booking.member.toString()
      );

      gymClass.currentCapacity = Math.max(
        0,
        gymClass.currentCapacity - 1
      );

      gymClass.status =
        gymClass.currentCapacity >= gymClass.capacity
          ? "Full"
          : "Open";

      await gymClass.save();
    }

    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ================= ADMIN UPDATE =================
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ message: "Not found" });

    if (req.body.status) {
      booking.status = req.body.status;
    }

    await booking.save();

    res.json({ message: "Updated", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= ADMIN DELETE =================
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Not found" });

    const gymClass = await Class.findById(booking.classId);

    if (gymClass && booking.status === "Booked") {
      gymClass.enrolledUsers = gymClass.enrolledUsers.filter(
        (u) => u.toString() !== booking.member.toString()
      );

      gymClass.currentCapacity = Math.max(
        0,
        gymClass.currentCapacity - 1
      );

      gymClass.status =
        gymClass.currentCapacity >= gymClass.capacity
          ? "Full"
          : "Open";

      await gymClass.save();
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  updateBooking,
  deleteBooking
};
