const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'An anime must have a name'],
    unique: true,
  },
  malId: {
    type: Number,
    required: [true, 'The data is imported from mal, where must have an id'],
  },
  imageUrl: {
    type: String,
    required: [true, 'An image its mandatory'],
  },
  rating: {
    type: Number,
    default: 5,
  },
  year: Number,
  studioName: String,
});

const Anime = mongoose.model('Anime', animeSchema);

module.exports = Anime;
