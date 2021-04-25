const { query } = require('express');
const AppError = require('../utils/AppError');
const Anime = require('../models/animeModel');
const APIFeatures = require('../utils/ApiFeatures');
const catchAsync = require('../utils/catchAsync');

// Middleware for alias
exports.aliasTop10 = (req, res, next) => {
  req.query.limit = '10';
  req.query.sort = '-rating, -year, malId';
  req.query.fields.concat('-__v,-malId');
  next();
};

exports.getAll = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Anime.find(), req.query).filter().sort().limitFields().paginate();
  const animes = await features.entityQuery;
  res.status(200).json({
    status: 'success',
    results: animes.length,
    data: {
      animes,
    },
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  // Anime.findOne({_id: req.params.id}) or equivalent mongoose shorthand findById:
  const features = new APIFeatures(Anime.findById(req.params.id), req.query).limitFields();
  const anime = await features.entityQuery;
  if (!anime) {
    return next(new AppError('No anime found with that Id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      anime: anime,
    },
  });
});

exports.addOne = catchAsync(async (req, res, next) => {
  // const newAnime = new Anime({}); newAnime.save();
  const newAnime = await Anime.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      anime: newAnime,
    },
  });
});

exports.modifyOne = catchAsync(async (req, res, next) => {
  const anime = await Anime.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //the return document will be the updated one, default false
    runValidators: true,
  });
  if (!anime) {
    return next(new AppError('No anime found with that Id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      anime: anime,
    },
  });
});

exports.deleteOne = (req, res) => {
  res.status(418).json({
    status: 'failed',
    message: 'Implemented deleteMany by console command',
  });
};

exports.getStatsBySource = catchAsync(async (req, res, next) => {
  const stats = await Anime.aggregate([
    {
      $match: { type: 'TV' },
    },
    {
      $group: {
        //using acumulators like sum, avg, first...
        _id: { $toUpper: '$source' }, // if use null as value -> it doesnt group
        numAnimes: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        minYear: { $min: '$year' },
      },
    },
    {
      $sort: { avgRating: -1 }, //we use the fields of group, because now that's are our 'documents' // 1 for asc, -1 for desc
    },
    {
      $match: { _id: { $ne: 'Test' } }, //its not going to filter because there is no Test source
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getStatsByGenre = catchAsync(async (req, res, next) => {
  const stats = await Anime.aggregate([
    {
      $unwind: '$genres',
    },
    {
      $sort: { title: 1 },
    },
    {
      $group: {
        _id: '$genres',
        numAnimes: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        // titles: { $push: '$title' }, // unccoment to show an array with all anime titles for that genre
      },
    },
    {
      $sort: { avgRating: -1 },
    },
    {
      $addFields: { genre: { $toUpper: '$_id' } },
    },
    {
      $project: { _id: 0 }, // hide with 0, show with 1
    },
    {
      $limit: 50, //not really useful here, just for know it exists
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
