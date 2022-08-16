const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRouts');
const userRouter = require('./routes/userRouts');

const app = express();

// 1) Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`)); // serving static html from folder

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
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
