const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRouts');
const userRouter = require('./routes/userRouts');

const app = express();

// 1) Global Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/// Request limiter
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  windowMs: 60 * 60 * 1000, // 60 Minutes
  message: `To many requests from this IP. Please try again in an hour`,
});
app.use('/api', limiter);

app.use(express.json());
app.use(express.static(`${__dirname}/public`)); // serving static html from folder

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 2) Routs
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Once response reaches this line, no resopnse is send, so we send this.
app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server ! `, 404));
});
// Error handeling middleware can use err from next().
app.use(globalErrorHandler);

/// 3) Start Server
module.exports = app;
