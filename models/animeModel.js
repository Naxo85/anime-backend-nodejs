const mongoose = require('mongoose');
const genres = require('../utils/genres');

const animeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'An anime must have a name'],
      unique: true,
      trim: true,
    },
    synopsis: {
      type: String,
      required: [true, 'An anime must have a synopsis'],
    },
    imageUrl: {
      type: String,
      required: [true, 'An image its mandatory'],
      validate: {
        validator: function (val) {
          const splittedValue = val.split('.');
          return splittedValue[splittedValue.length - 1] === 'jpg';
        },
        message: '({VALUE}) not accepted. Only ".jpg" format is accepted',
      },
    },
    rating: {
      type: Number,
      default: 5,
      min: [1, 'Rating must be above 0'],
      max: [10, 'Rating must be below 10'],
    },
    malId: {
      type: Number,
      required: [true, 'The data is imported from mal, where it must have an id'],
    },
    episodes: Number,
    year: Number,
    source: String,
    type: String,
    studioName: String,
    genres: [
      {
        type: String,
        enum: genres,
      },
    ],
  },
  {
    id: false, //if not, when activate virtuals appears another id virtual field generate by mongoose
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

animeSchema.virtual('numberGenres').get(function () {
  if (this.genres) return this.genres.length;
});

// Mongoose middelwares (with pre and post hooks): document, query, aggregate and model

// Document middelwares: 'this' points to document object
// animeSchema.pre('save', function (next) {
//   console.log(this);
//   next();
// });
// animeSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// Query middelwares: 'this' points to query object
animeSchema.pre(/(?=^find)(?=(?!findOneAndUpdate))/, function (next) {
  console.log('ENTRA');
  this.find({ title: { $ne: 'PRUEBA' } });
  this.start = Date.now();
  next();
});
animeSchema.post(/(?=^find)(?=(?!findOneAndUpdate))/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// Aggregation middelwares: 'this' points to aggregation object
animeSchema.pre('aggregate', function (next) {
  // pipeline return the array we pass to the aggregation, unshift add to the start of the array something
  this.pipeline().unshift({
    $match: { title: { $ne: 'PRUEBA' } },
  });
  next();
});

const Anime = mongoose.model('Anime', animeSchema);

module.exports = Anime;
