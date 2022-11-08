const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

// get all revies
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

// create new review
exports.createNewReview = catchAsync(async (req, res, next) => {
  // Allows nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  // await the creation of a review from req.body based on the Review model.
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
