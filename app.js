const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRouts');
const userRouter = require('./routes/userRouts');
const reviewRouter = require('./routes/reviewRouts');

const app = express();

/// setting up the template view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

///////////// 1) Global Middlewares

// Serving static files
// app.use(express.static(`${__dirname}/public`)); // serving static html from folder
app.use(express.static(path.join(__dirname, 'public')));

// set security HTTP headers
app.use(helmet());

// development loggin
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/// Request limiter from same API
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per `window` (here, per 1 hour)
  windowMs: 60 * 60 * 1000, // 60 Minutes ( 1 hour )
  message: `To many requests from this IP. Please try again in an hour`,
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization agains XSS
app.use(xss());

// Prevent parameter polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

////////////////// 2) Routes
/// Template routes
app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'The Forest Hiker',
    user: 'Jonas',
  });
});

/// API ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// Once response reaches this line, no resopnse is send, so we send this.
app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server ! `, 404));
});
// Error handeling middleware can use err from next().
app.use(globalErrorHandler);

/// 3) Start Server
module.exports = app;
