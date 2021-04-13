const MalWrapper = require('../modules/MalWrapper');
const malWrapper = new MalWrapper();

exports.getUserAnimeList = (req, res) => {
  malWrapper.findUser(req.params.nickname, 'animelist').then((info) =>
    res.status(200).json({
      status: 'sucess',
      results: info.anime.length,
      data: info.anime,
    })
  );
};
