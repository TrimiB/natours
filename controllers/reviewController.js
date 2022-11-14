const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

/// get all revies
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  // await finden the revires from Review.
  const reviews = await Review.find(filter);

  // Send response
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      revies: reviews,
    },
  });
});

// Middleware fn
exports.setTourUserIds = (req, res, next) => {
  // Allows nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

/// create new review
exports.createNewReview = factory.createOne(Review);

/// Update Review
exports.updateReview = factory.updateOne(Review);

/// Delete review
exports.deleteReview = factory.deleteOne(Review);
