const MalWrapper = require('../modules/MalWrapper');

const malWrapper = new MalWrapper();

exports.getTopAnimes = (req, res) => {
  malWrapper
    .findTop('anime', 2)
    .then((info) =>
      res.status(200).json({
        status: 'sucess',
        results: info.top.length,
        data: info.top,
      })
    )
    .catch(() => {
      res.status(500).json({
        status: 'failed',
        data: 'Internal Error',
      });
    });
};
