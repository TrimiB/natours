const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

// get all revies
exports.getAllReviews = catchAsync(async (req, res, next) => {
  // await finden the revires from Review.
  const reviews = await Review.find();

  // Send response
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      revies: reviews,
    },
  });
});

// create new review
exports.createNewReview = catchAsync(async (req, res, next) => {
  // await the creation of a review from req.body based on the Review model.
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
