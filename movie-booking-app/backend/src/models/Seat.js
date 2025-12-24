const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  showId: String,
  seatId: String,
  status: {
    type: String,
    enum: ["AVAILABLE", "HELD", "BOOKED"],
    default: "AVAILABLE"
  },
  heldBy: String,
  bookingId: String,
  holdExpiresAt: Date,
  bookedBy: String,
  bookedAt: Date
});

module.exports = mongoose.model("Seat", seatSchema);
