const Restaurant = require('../models/restaurant.model');
const Food = require('../models/food.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validFood = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const food = await Food.findOne({
    where: {
      id,
      status: 'active',
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'restaurantId', 'status'],
    },
    include: [
      {
        model: Restaurant,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'status'],
        },
      },
    ],
  });

  if (!food) {
    return next(new AppError(`No se encontró la comida con id:${id} 😔`, 404));
  }

  req.food = food;
  next();
});
