const express = require('express');
const morgan = require('morgan');
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
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) Routs
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

/// 3) Start Server
module.exports = app;
