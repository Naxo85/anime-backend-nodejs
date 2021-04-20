const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const utilRouter = require('./routes/utilRoutes');
const animeRouter = require('./routes/animeRoutes');

const app = express();

//Global Middlewares
app.use(express.json()); //It parses incoming requests with JSON payloads and is based on body-parser.
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(`Hi from middleware! 🙌 \nI've reveceived a request at ${req.requestTime}`);
    next();
  });
}
app.use(morgan('dev')); //HTTP request logger middleware

//Routers (also middelwares)
app.use('/api.myanime/v1/utils/', utilRouter);
app.use('/api.myanime/v1/animes/', animeRouter);
app.use('/api.myanime/v1/users/', userRouter);

module.exports = app;
