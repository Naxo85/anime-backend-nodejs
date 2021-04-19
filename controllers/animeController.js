const Anime = require('../models/animeModel');

exports.getAll = (req, res) => {
  res.status(200).json({
    status: 'success',
  });
};
exports.getOne = (req, res) => {
  res.status(200).json({
    status: 'success',
  });
};
exports.addOne = async (req, res) => {
  try {
    // const newAnime = new Anime({});
    // newAnime.save();
    // or equivalent:
    const newAnime = await Anime.create(req.body);
    res.status(201).json({
      status: 'success',
      anime: newAnime,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};
exports.modifyOne = (req, res) => {
  res.status(200).json({
    status: 'success',
  });
};
exports.deleteOne = (req, res) => {
  res.status(200).json({
    status: 'success',
  });
};
