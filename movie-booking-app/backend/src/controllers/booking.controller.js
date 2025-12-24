const Seat = require("../models/Seat");
const { v4: uuidv4 } = require("uuid");

/* Seed Seats */
exports.seedSeats = async (req, res) => {
  const seats = [];
  for (let i = 1; i <= 30; i++) {
    seats.push({ seatId: `A${i}` });
  }
  await Seat.deleteMany();
  await Seat.insertMany(seats);
  res.json({ message: "Seats created" });
};

/* Get Seats */
exports.getSeats = async (req, res) => {
  const seats = await Seat.find();
  res.json(seats);
};

/* Hold Seat */
exports.holdSeat = async (req, res) => {
  const { seatId, user } = req.body;
  const seat = await Seat.findOne({ seatId });

  if (!seat || seat.status !== "AVAILABLE") {
    return res.status(400).json({ message: "Seat not available" });
  }

  seat.status = "HELD";
  seat.heldBy = user;
  seat.holdId = uuidv4();
  seat.holdExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await seat.save();
  res.json(seat);
};

/* Confirm Seat */
exports.confirmSeat = async (req, res) => {
  const { seatId, holdId, user } = req.body;
  const seat = await Seat.findOne({ seatId });

  if (!seat || seat.holdId !== holdId || seat.heldBy !== user) {
    return res.status(400).json({ message: "Invalid hold" });
  }

  seat.status = "BOOKED";
  seat.bookedBy = user;
  seat.heldBy = null;
  seat.holdId = null;

  await seat.save();
  res.json(seat);
};

/* Cancel Hold */
exports.cancelHold = async (req, res) => {
  const { seatId, holdId } = req.body;
  const seat = await Seat.findOne({ seatId });

  if (seat && seat.holdId === holdId) {
    seat.status = "AVAILABLE";
    seat.heldBy = null;
    seat.holdId = null;
    await seat.save();
  }

  res.json({ message: "Hold cancelled" });
};
