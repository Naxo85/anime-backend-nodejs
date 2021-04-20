const { query } = require('express');
const Anime = require('../models/animeModel');
const APIFeatures = require('../utils/APIFeatures');

exports.aliasTop10 = (req, res, next) => {
  req.query.limit = '10';
  req.query.sort = '-rating, -year, malId';
  req.query.fields = '-__v,-malId';
  next();
};

exports.getAll = async (req, res) => {
  try {
    const features = new APIFeatures(Anime, req.query).filter().sort().limitFields().paginate();
    const animes = await features.entityQuery;
    res.status(200).json({
      status: 'success',
      results: animes.length,
      data: {
        animes,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.getOne = async (req, res) => {
  try {
    // Anime.findOne({_id: req.params.id}) or equivalent mongoose shorthand:
    const anime = await Anime.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        anime: anime,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.addOne = async (req, res) => {
  try {
    // const newAnime = new Anime({});
    // newAnime.save();
    // or equivalent:
    const newAnime = await Anime.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        anime: newAnime,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.modifyOne = async (req, res) => {
  try {
    const anime = await Anime.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //the return document must be the updated one, default false
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        anime: anime,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.deleteOne = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Not implemented',
  });
};
