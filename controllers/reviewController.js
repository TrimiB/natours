const Review = require('../models/reviewModel');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

/// get all revies
// Middleware fn
exports.setTourUserIds = (req, res, next) => {
  // Allows nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

/// Get all Reviews
exports.getAllReviews = factory.getAll(Review);

/// Get single Review
exports.getReview = factory.getOne(Review);

/// create new review
exports.createNewReview = factory.createOne(Review);

/// Update Review
exports.updateReview = factory.updateOne(Review);

/// Delete review
exports.deleteReview = factory.deleteOne(Review);
