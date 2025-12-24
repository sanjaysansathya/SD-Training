import express from "express";
import cors from "cors";
import movieRoutes from "./routes/movie.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/movies", movieRoutes);
app.use("/api/booking", bookingRoutes);

export default app;
