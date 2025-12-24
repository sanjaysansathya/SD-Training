import { useState } from "react";
import MovieCard from "./components/MovieCard";
import Showtime from "./components/Showtime";
import SeatLayout from "./components/SeatLayout";
import "./styles/app.css";

const MOVIE = { title: "Sample Movie" };

export default function App() {
  const [step, setStep] = useState("movie");

  return (
    <div className="container">
      <h1>Movie Booking</h1>

      {step === "movie" && (
        <MovieCard
          movie={MOVIE}
          onBook={() => setStep("show")}
        />
      )}

      {step === "show" && (
        <Showtime onSelect={() => setStep("seat")} />
      )}

      {step === "seat" && <SeatLayout />}
    </div>
  );
}
