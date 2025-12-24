import "../styles/movie.css";

export default function MovieCard({ movie, onBook }) {
  return (
    <div className="movie-card">
      <img
        src="https://via.placeholder.com/200x280"
        alt={movie.title}
      />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>⭐ 8.5 | Action / Drama</p>
        <button onClick={onBook}>Book Tickets</button>
      </div>
    </div>
  );
}
