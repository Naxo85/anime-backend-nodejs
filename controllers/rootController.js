const MalWrapper = require('../modules/MalWrapper');
const malWrapper = new MalWrapper();

exports.getTopAnimes = (req, res) => {
  //zzzzzzzz agregar catch al findTop por si algo va mal
  malWrapper.findTop('anime', 2).then((info) =>
    res.status(200).json({
      status: 'sucess',
      results: info.top.length,
      data: info.top,
    })
  );
};
