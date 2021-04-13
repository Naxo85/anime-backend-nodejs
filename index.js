const express = require('express');
const Jikan = require('jikan-node');
const MalWrapper = require('./modules/MalWrapper');

const app = express();
const mal = new Jikan();
const malWrapper = new MalWrapper();

const prueba = app.get(['/', '/myanime'], (req, res) => {
  mal.findTop('anime').then((info) =>
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
