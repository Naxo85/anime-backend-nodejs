const MalWrapper = require('../utils/MalWrapper');
const HttpError = require('../utils/HttpError');

const malWrapper = new MalWrapper();

exports.checkNickName = (req, res, next, val) => {
  if (typeof val !== 'string') {
    return res.status(400).json({
      status: 'failed',
      data: 'Invalid nickname!',
    });
  }
  next();
};

exports.getUserAnimeList = (req, res) => {
  malWrapper
    .findUser(req.params.nickname, 'animelist')
    .then((info) =>
      res.status(200).json({
        status: 'success',
        results: info.anime.length,
        data: info.anime,
      })
    )
    .catch((err) => {
      if (err instanceof HttpError && err.response.status === 400) {
        res.status(404).json({
          status: 'failed',
          data: 'User not found',
        });
      } else {
        res.status(500).json({
          status: 'failed',
          data: 'Internal Error',
        });
      }
    });
};
