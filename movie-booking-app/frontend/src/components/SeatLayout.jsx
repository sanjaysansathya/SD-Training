import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/seat.css";

export default function SeatLayout() {
  const [seats, setSeats] = useState([]);
  const [showId, setShowId] = useState("");
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [name, setName] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [message, setMessage] = useState("");

  const loadSeats = async (id) => {
    if (!id) return;
    const res = await axios.get(`http://localhost:5000/api/seats/${id}`);
    setSeats(res.data);
  };

  useEffect(() => {
    const init = async () => {
      const savedShowId = localStorage.getItem("showId");

      if (savedShowId) {
        setShowId(savedShowId);
        await loadSeats(savedShowId);
      } else {
        const res = await axios.post("http://localhost:5000/api/seats/seed");
        localStorage.setItem("showId", res.data.showId);
        setShowId(res.data.showId);
        await loadSeats(res.data.showId);
      }
    };

    init();
  }, []);

  const holdSeat = async () => {
    if (!selectedSeat || !name) {
      setMessage("Select a seat and enter your name");
      return;
    }

    const res = await axios.post("http://localhost:5000/api/seats/hold", {
      showId,
      seatId: selectedSeat,
      name
    });

    setBookingId(res.data.bookingId);
    setMessage(`Seat ${selectedSeat} held`);
    loadSeats(showId);
  };

  const confirmSeat = async () => {
    await axios.post("http://localhost:5000/api/seats/confirm", { bookingId });
    setMessage(`Booking confirmed for Show ID: ${showId}`);
    loadSeats(showId);
  };

  const cancelHold = async () => {
    await axios.post("http://localhost:5000/api/seats/cancel", { bookingId });
    setBookingId("");
    setMessage("Hold cancelled");
    loadSeats(showId);
  };

  return (
    <div className="booking-container">
      <header>
        <h1>🎬 Movie Booking</h1>
        <p className="show-id">Show ID: {showId}</p>
      </header>

      <div className="layout">
        {/* Seat Section */}
        <div className="seat-section">
          <h3>Select Your Seat</h3>

          <div className="screen">SCREEN</div>

          <div className="grid">
            {seats.map(seat => (
              <div
                key={seat.seatId}
                className={`seat ${seat.status} ${
                  selectedSeat === seat.seatId ? "selected" : ""
                }`}
                onClick={() =>
                  seat.status === "AVAILABLE" &&
                  setSelectedSeat(seat.seatId)
                }
              >
                {seat.seatId}
              </div>
            ))}
          </div>

          <div className="legend">
            <span className="seat AVAILABLE">Available</span>
            <span className="seat HELD">Held</span>
            <span className="seat BOOKED">Booked</span>
          </div>
        </div>

        {/* Action Panel */}
        <div className="action-panel">
          <h3>Booking Details</h3>

          <p>
            Selected Seat: <strong>{selectedSeat || "None"}</strong>
          </p>

          <input
            placeholder="Your Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <button onClick={holdSeat} disabled={!selectedSeat || !name}>
            Hold Seat
          </button>

          <button onClick={confirmSeat} disabled={!bookingId}>
            Confirm Booking
          </button>

          <button
            onClick={cancelHold}
            disabled={!bookingId}
            className="cancel"
          >
            Cancel Hold
          </button>

          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
}
