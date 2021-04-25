const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
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
app.all('*', (req, res, next) => {
  // if next receive an argument, express knows it's an error and sends it directly to global error handling
  next(new AppError(`Can't find route: ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
