const Reviews = require('../models/review.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Restaurant = require('../models/restaurant.model');

exports.findRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findAll({
    where: {
      status: 'active',
    },
    include: [
      {
        model: Reviews,
        where: { status: 'active' },
        attributes: { exclude: ['createdAt', 'updatedAt', 'status'] },
        required: false,
      },
    ],
    attributes: { exclude: ['createdAt', 'updatedAt', 'status'] },
  });

  res.status(200).json({
    status: 'success',
    results: restaurant.length,
    restaurant,
  });
});

exports.newRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  const restaurantInDb = await Restaurant.findOne({
    where: {
      address: address.toLowerCase(),
    },
  });

  if (restaurantInDb) {
    return next(new AppError('Ya hay un restaurante con esta dirección', 409));
  }

  const restaurant = await Restaurant.create({
    name: name.toLowerCase(),
    address: address.toLowerCase(),
    rating,
  });

  res.status(201).json({
    status: 'success',
    message: 'el restaurante fue creado!',
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      rating: restaurant.rating,
    },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const { review } = req;
  const { comment, rating } = req.body;

  const updateReview = await review.update({ comment, rating });

  res.status(200).json({
    status: 'success',
    message: 'La reseña fue actualizada!',
    updateReview,
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const { review } = req;

  await review.update({ status: 'deleted' });
  res.status(200).json({
    status: 'success',
    message: 'El review ha sido borrado',
  });
});

exports.newReview = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const { sessionUser } = req;
  const { comment, rating } = req.body;

  const review = await Reviews.create({
    comment,
    rating,
    restaurantId: restaurant.id,
    userId: sessionUser.id,
  });

  res.status(200).json({
    status: 'success',
    message: 'tu has creado un nuevo review',
    review: {
      comment: review.comment,
      rating: review.rating,
      restaurant: restaurant.name,
    },
  });
});

exports.findRestaurantById = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  res.status(200).json({
    status: 'exitoso',
    restaurant,
  });
});

exports.updateRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const { name, address } = req.body;

  const updatedRestaurant = await restaurant.update({
    name: name.toLowerCase(),
    address: address.toLowerCase(),
  });

  res.status(200).json({
    status: 'exitoso',
    message: 'el restaurante fue actualizado.',
    updatedRestaurant,
  });
});

exports.deleteRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  await restaurant.update({ status: 'disabled' });

  res.status(200).json({
    status: 'exitoso',
    message: 'el restaurate fue eliminado.',
  });
});
