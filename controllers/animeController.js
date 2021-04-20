const { query } = require('express');
const Anime = require('../models/animeModel');

exports.aliasTop10 = (req, res, next) => {
  req.query.limit = '10';
  req.query.sort = '-rating, -year, malId';
  req.query.fields = '-__v,-malId';
  next();
};

exports.getAll = async (req, res) => {
  try {
    const queryObj = { ...req.query }; //harcoded copy, not just reference
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // gte or similar filters, in mongoDB { rating: { $get: 8} }
    // express give us a query almost equal, without $ mongo operator, if we use in the url: ?rating[gte]=8
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // For filtering we can use the filter Object inside find or use moongose methods
    // Anime.find(queryObj);
    let query = Anime.find().where(JSON.parse(queryStr));

    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query.sort(sortBy);
    }

    // fields limiting: projecting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    }

    // pagination, default value page=1 & limit=100
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const resultsSkipped = (page - 1) * limit;
    if (req.query.page) {
      if (resultsSkipped >= (await Anime.countDocuments())) {
        throw new Error('This page doesnt exist');
      }
    }
    query = query.skip(resultsSkipped).limit(limit);

    const animes = await query;

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
