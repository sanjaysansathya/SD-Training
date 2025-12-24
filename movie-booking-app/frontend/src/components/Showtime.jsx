export default function Showtime({ onSelect }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Select Showtime</h3>
      <div style={{ display: "flex", gap: "15px" }}>
        {["10:30 AM", "2:00 PM", "6:30 PM", "10:00 PM"].map(time => (
          <button
            key={time}
            onClick={() => onSelect(time)}
            style={{
              padding: "10px 18px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              background: "white",
              cursor: "pointer"
            }}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}
