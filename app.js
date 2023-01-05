const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRouts');
const userRouter = require('./routes/userRouts');
const reviewRouter = require('./routes/reviewRouts');
const bookingRouter = require('./routes/bookingRouts');
const viewRouter = require('./routes/viewRouts');

const app = express();

/// setting up the template view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

///////////// 1) Global Middlewares

// Serving static files
// app.use(express.static(`${__dirname}/public`)); // serving static html from folder
app.use(express.static(path.join(__dirname, 'public')));

// set security HTTP headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https:', 'data:', 'ws:'],
      baseUri: ["'self'"],
      imgSrc: ["'self'", 'https:', 'data:'],
      fontSrc: ["'self'", 'https:', 'data:'],
      scriptSrc: ["'self'", 'https:', 'blob:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
    },
  })
);

// scriptSrc: ["'self'", 'https://unpkg.com/leaflet@1.9.3/dist/'],
//       imgSrc: [
//         "'self'",
//         'https://unpkg.com/leaflet@1.9.3/dist/',
//         'https://tile.openstreetmap.org',
//         'data:',
//       ],

// development loggins
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
// Form parser, reading data from Forms into rec.body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// Cookie parser, reading cookies from body into req.body
app.use(cookieParser());

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
  // console.log(req.cookies);
  // console.log(req.headers);
  next();
});

////////////////// 2) Routes
/// Template routes
app.use('/', viewRouter);

/// API ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRouter);

// Once response reaches this line, no resopnse is send, so we send this.
app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server ! `, 404));
});
// Error handeling middleware can use err from next().
app.use(globalErrorHandler);

/// 3) Start Server
module.exports = app;
