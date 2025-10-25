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


// =========================
// 3. SHOWTIME SCHEMA
// =========================


// =========================
// 4. BOOKING SCHEMA
// =========================


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
