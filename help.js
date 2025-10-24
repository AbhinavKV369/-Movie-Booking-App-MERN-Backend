import mongoose from "mongoose";

// =========================
// 1. CAST SCHEMA
// =========================
const castSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  profile_path: {
    type: String,
    required: true,
  },
});

// =========================
// 2. MOVIE SCHEMA
// =========================
const genreSchema = new mongoose.Schema({
  id: Number,
  name: String,
});

const movieSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  overview: String,
  poster_path: String,
  backdrop_path: String,
  genres: [genreSchema],
  casts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cast",
    },
  ],
  release_date: Date,
  original_language: String,
  tagline: String,
  vote_average: Number,
  vote_count: Number,
  runtime: Number,
});

// =========================
// 3. SHOWTIME SCHEMA
// =========================
const showTimeSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  showDateTime: {
    type: Date,
    required: true,
  },
  showPrice: {
    type: Number,
    required: true,
  },
  occupiedSeats: {
    type: Map,
    of: String, // stores user IDs (or booking IDs)
    default: {},
  },
});

// =========================
// 4. BOOKING SCHEMA
// =========================
const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Make sure User model exists
    required: true,
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShowTime",
    required: true,
  },
  bookedSeats: {
    type: [String],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
});

// =========================
// 5. DASHBOARD SCHEMA (optional summary)
// =========================
const dashboardSchema = new mongoose.Schema({
  totalBookings: {
    type: Number,
    default: 0,
  },
  totalRevenue: {
    type: Number,
    default: 0,
  },
  totalUser: {
    type: Number,
    default: 0,
  },
  activeShows: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShowTime",
    },
  ],
});

// =========================
// 6. EXPORT MODELS
// =========================
export const Cast = mongoose.model("Cast", castSchema);
export const Movie = mongoose.model("Movie", movieSchema);
export const ShowTime = mongoose.model("ShowTime", showTimeSchema);
export const Booking = mongoose.model("Booking", bookingSchema);
export const Dashboard = mongoose.model("Dashboard", dashboardSchema);
