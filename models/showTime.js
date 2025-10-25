import mongoose from "mongoose";

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
    of: String, 
    default: {},
  },
});

const ShowTime = mongoose.model("ShowTime",showTimeSchema);