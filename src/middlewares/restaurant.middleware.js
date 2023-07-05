const Restaurant = require('../models/restaurant.model');
const Food = require('../models/food.model');
const Reviews = require('../models/review.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({
    where: {
      id,
      status: 'active',
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Reviews,
        where: { status: 'active' },
        attributes: { exclude: ['createdAt', 'updatedAt', 'restaurantId'] },
        required: false,
      },
      {
        model: Food,
      },
    ],
  });

  if (!restaurant) {
    return next(new AppError(`el restaurante con ${id} no fue encotrado 😔`, 404));
  }

  req.food = restaurant.food;
  req.restaurant = restaurant;
  next();
});

exports.validReview = catchAsync(async (req, res, next) => {
  const { restaurantId, id } = req.params;

  const review = await Reviews.findOne({
    where: {
      id,
      restaurantId,
      status: 'active',
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  });

  if (!review) {
    return next(new AppError(`el review no fue encontrado 😔`, 404));
  }

  req.review = review;
  next();
});