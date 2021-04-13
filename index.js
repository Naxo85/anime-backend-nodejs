const express = require('express');
const MalWrapper = require('./modules/MalWrapper');

const app = express();
const malWrapper = new MalWrapper();

const prueba = app.get(['/', '/myanime'], (req, res) => {
  //zzzzzzzz agregar catch al findTop por si algo va mal
  malWrapper.findTop('anime').then((info) =>
    res.status(200).json({
      status: 'sucess',
      results: info.top.length,
      message: info.top,
    })
  );
});

//Server initiation
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
