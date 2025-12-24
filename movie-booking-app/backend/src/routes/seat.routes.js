const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const Seat = require("../models/Seat");

/* Seed show */
router.post("/seed", async (req, res) => {
  const showId = uuid();

  const seats = Array.from({ length: 30 }, (_, i) => ({
    showId,
    seatId: `A${i + 1}`
  }));

  await Seat.insertMany(seats);
  res.json({ showId });
});

/* Get seats */
router.get("/:showId", async (req, res) => {
  const seats = await Seat.find({ showId: req.params.showId });
  res.json(seats);
});

/* Hold seat */
router.post("/hold", async (req, res) => {
  const { showId, seatId, name } = req.body;
  const bookingId = uuid();

  const seat = await Seat.findOne({ showId, seatId });

  if (!seat || seat.status !== "AVAILABLE") {
    return res.status(400).json({ error: "Seat not available" });
  }

  seat.status = "HELD";
  seat.heldBy = name;
  seat.bookingId = bookingId;
  seat.holdExpiresAt = new Date(Date.now() + 2 * 60 * 1000);

  await seat.save();
  res.json({ bookingId });
});

/* Confirm booking */
router.post("/confirm", async (req, res) => {
  const { bookingId } = req.body;

  const seat = await Seat.findOne({ bookingId });
  if (!seat) return res.status(400).json({ error: "Invalid booking" });

  seat.status = "BOOKED";
  seat.bookedBy = seat.heldBy;
  seat.bookedAt = new Date();

  await seat.save();
  res.json({ success: true });
});

/* Cancel hold */
router.post("/cancel", async (req, res) => {
  const { bookingId } = req.body;

  const seat = await Seat.findOne({ bookingId });
  if (!seat) return res.json({ success: true });

  seat.status = "AVAILABLE";
  seat.heldBy = null;
  seat.bookingId = null;
  seat.holdExpiresAt = null;

  await seat.save();
  res.json({ success: true });
});

module.exports = router;
