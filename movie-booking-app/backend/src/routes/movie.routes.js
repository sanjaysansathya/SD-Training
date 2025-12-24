import express from "express";
import { fetchMovies } from "../controllers/movie.controller.js";
const router = express.Router();
router.get("/", fetchMovies);
export default router;
