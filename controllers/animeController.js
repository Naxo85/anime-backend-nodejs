const { query } = require('express');
const Anime = require('../models/animeModel');
const APIFeatures = require('../utils/ApiFeatures');

// Middleware for alias
exports.aliasTop10 = (req, res, next) => {
  req.query.limit = '10';
  req.query.sort = '-rating, -year, malId';
  req.query.fields = '-__v,-malId';
  next();
};

function genericError(res, err) {
  res.status(500).json({
    status: 'failed',
    message: err.message,
  });
}

exports.getAll = async (req, res) => {
  try {
    const features = new APIFeatures(Anime.find(), req.query).filter().sort().limitFields().paginate();
    const animes = await features.entityQuery;
    res.status(200).json({
      status: 'success',
      results: animes.length,
      data: {
        animes,
      },
    });
  } catch (err) {
    genericError(res, err);
  }
};

exports.getOne = async (req, res) => {
  try {
    // Anime.findOne({_id: req.params.id}) or equivalent mongoose shorthand findById:
    const features = new APIFeatures(Anime.findById(req.params.id), req.query).limitFields();
    const anime = await features.entityQuery;
    res.status(200).json({
      status: 'success',
      data: {
        anime: anime,
      },
    });
  } catch (err) {
    genericError(res, err);
  }
};

exports.addOne = async (req, res) => {
  try {
    // const newAnime = new Anime({}); newAnime.save();
    const newAnime = await Anime.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        anime: newAnime,
      },
    });
  } catch (err) {
    genericError(res, err);
  }
};

exports.modifyOne = async (req, res) => {
  try {
    const anime = await Anime.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //the return document will be the updated one, default false
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        anime: anime,
      },
    });
  } catch (err) {
    genericError(res, err);
  }
};

exports.deleteOne = (req, res) => {
  res.status(418).json({
    status: 'failed',
    message: 'Implemented deleteMany by console command',
  });
};
