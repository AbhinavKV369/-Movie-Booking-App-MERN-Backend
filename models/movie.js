import mongoose from "mongoose";

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

const Movie = mongoose.model("Movie",movieSchema);

export default Movie;
