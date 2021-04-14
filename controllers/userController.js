const MalWrapper = require('../modules/MalWrapper');
const malWrapper = new MalWrapper();
const HttpError = require('../modules/HttpError');

exports.checkNickName = (res, val) => {
  if (!val instanceof String) {
    console.log(val);
    return res.status(400).json({
      status: 'failed',
      data: 'Invalid nickname',
    });
  }
};

exports.getUserAnimeList = (req, res) => {
  malWrapper
    .findUser(req.params.nickname, 'animelist')
    .then((info) =>
      res.status(200).json({
        status: 'sucess',
        results: info.anime.length,
        data: info.anime,
      })
    )
    .catch((err) => {
      if (err instanceof HttpError && err.response.status == 400) {
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
