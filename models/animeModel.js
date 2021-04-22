const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'An anime must have a name'],
    unique: true,
  },
  synopsis: {
    type: String,
    required: [true, 'An anime must have a synopsis'],
  },
  imageUrl: {
    type: String,
    required: [true, 'An image its mandatory'],
  },
  rating: {
    type: Number,
    default: 5,
  },
  malId: {
    type: Number,
    required: [true, 'The data is imported from mal, where must have an id'],
  },
  episodes: Number,
  year: Number,
  source: String,
  type: String,
  studioName: String,
  genres: [
    {
      type: String,
    },
  ],
});

const Anime = mongoose.model('Anime', animeSchema);

module.exports = Anime;
