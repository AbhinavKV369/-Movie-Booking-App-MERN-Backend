import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
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

const Booking = mongoose.model("Booking",bookingSchema);

export default Booking;