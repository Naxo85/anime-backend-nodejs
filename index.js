const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const rootRouter = require('./routes/rootRoutes');

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
app.use('/api.myanime/v1/', rootRouter);
app.use('/api.myanime/v1/users/', userRouter);

module.exports = app;
