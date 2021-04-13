const express = require('express');
const app = express();
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const rootRouter = require('./routes/rootRoutes');

//Global Middlewares
app.use(express.json()); //It parses incoming requests with JSON payloads and is based on body-parser.
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`Hi from middleware! 🙌 \nI\'ve reveceived a request at ${req.requestTime}`);
  next();
});
app.use(morgan('dev')); //HTTP request logger middleware

//Routers (also middelwares, with target)
app.use('/api.myanime/v1/', rootRouter);
app.use('/api.myanime/v1/users/', userRouter);

module.exports = app;
