const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'An anime must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
  },
});

const Anime = mongoose.model('Anime', animeSchema);

module.exports = Anime;
