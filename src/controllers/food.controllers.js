const Food = require('../models/food.model');
const Restaurant = require('../models/restaurant.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.findFood = catchAsync(async (req, res, next) => {
  const food = await Food.findAll({
    where: {
      status: 'active',
    },
    attributes: {
      exclude: ['createdAt', 'updateAt', 'status', 'restaurantId'],
    },
    include: [
      {
        model: Restaurant,
        attributes: { exclude: ['createdAt', 'updateAt', 'status'] },
      },
    ],
  });
  res.status(201).json({
    status: 'success',
    results: food.length,
    meals,
  });
});

exports.findFoodById = catchAsync(async (req, res, next) => {
  const { food } = req;

  res.status(201).json({
    status: 'status',
    food,
  });
});

exports.newFood = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { id } = req.body;
  const { restaurant } = req;

  const foodInDB = await Food.finOne({
    where: {
      name,
    },
  });

  if (foodInDB) {
    return next(new AppError('Ya existe una comida con este nombre', 409));
  }

  const food = await Food.createe({
    name,
    price,
    restaurantId: id,
  });

  res.status(201).json({
    status: 'success',
    message: 'La comida fue creada',
    food: {
      id: food.id,
      name: food.name,
      price: food.price,
      restaurant: restaurant.name,
    },
  });
});

exports.updateFood = catchAsync(async (req, res, next) => {
  const { food } = req;
  const { name, price } = req.body;

  const updateFood = await food.update({ name, price });

  res.status(201).json({
    status: 'success',
    message: 'la comida fue actualizada',
    updateFood,
  });
});

exports.deleteFood = catchAsync(async (req, res, next) => {
  const { food } = req;

  await food.update({ status: 'disabled' });

  res.status(201).json({
    status: 'success',
    message: 'la comida fue eliminada',
  });
});
