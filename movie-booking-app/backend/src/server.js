const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

/**
 * In-memory DB
 */
const shows = {}; 
// {
//   showId: {
//     seats: [{ seatId, status, bookingId, heldBy }]
//   }
// }

/**
 * CREATE SHOW + 30 SEATS
 */
app.post("/api/seats/seed", (req, res) => {
  const showId = uuid();

  const seats = Array.from({ length: 30 }, (_, i) => ({
    seatId: `A${i + 1}`,
    status: "AVAILABLE",
    bookingId: null,
    heldBy: null
  }));

  shows[showId] = { seats };

  res.json({ showId });
});

/**
 * GET ALL SEATS
 */
app.get("/api/seats/:showId", (req, res) => {
  const show = shows[req.params.showId];
  if (!show) return res.json([]);
  res.json(show.seats);
});

/**
 * HOLD SEAT
 */
app.post("/api/seats/hold", (req, res) => {
  const { showId, seatId, name } = req.body;
  const show = shows[showId];
  if (!show) return res.status(404).json({ error: "Show not found" });

  const seat = show.seats.find(s => s.seatId === seatId);
  if (!seat || seat.status !== "AVAILABLE") {
    return res.status(400).json({ error: "Seat not available" });
  }

  const bookingId = uuid();
  seat.status = "HELD";
  seat.bookingId = bookingId;
  seat.heldBy = name;

  res.json({ bookingId });
});

/**
 * CONFIRM SEAT
 */
app.post("/api/seats/confirm", (req, res) => {
  const { bookingId } = req.body;

  for (const show of Object.values(shows)) {
    const seat = show.seats.find(s => s.bookingId === bookingId);
    if (seat) {
      seat.status = "BOOKED";
      return res.json({ success: true });
    }
  }

  res.status(404).json({ error: "Booking not found" });
});

/**
 * CANCEL HOLD
 */
app.post("/api/seats/cancel", (req, res) => {
  const { bookingId } = req.body;

  for (const show of Object.values(shows)) {
    const seat = show.seats.find(s => s.bookingId === bookingId);
    if (seat) {
      seat.status = "AVAILABLE";
      seat.bookingId = null;
      seat.heldBy = null;
      return res.json({ success: true });
    }
  }

  res.status(404).json({ error: "Booking not found" });
});

app.listen(5000, () =>
  console.log("✅ Backend running on http://localhost:5000")
);
