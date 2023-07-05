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
    food,
  });
});

exports.findFoodById = catchAsync(async (req, res, next) => {
  const { foods } = req;

  res.status(201).json({
    status: 'status',
    foods,
  });
});

exports.newFood = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { id } = req.params;
  const { restaurant } = req;

  const foodInDB = await Food.findOne({
    where: {
      name,
    },
  });

  if (foodInDB) {
    return next(new AppError('Ya existe una comida con este nombre', 409));
  }

  const foods = await Food.create({
    name,
    price,
    restaurantId: id
  });

  res.status(201).json({
    status: 'success',
    message: 'La comida fue creada',
    foods: {
      id: foods.id,
      name: foods.name,
      price: foods.price,
      restaurant: restaurant.name,
    },
  });
});

exports.updateFood = catchAsync(async (req, res, next) => {
  const { foods } = req;
  const { name, price } = req.body;

  const updateFoods = await foods.update({ name, price });

  res.status(201).json({
    status: 'success',
    message: 'la comida fue actualizada',
    updateFoods,
  });
});

exports.deleteFood = catchAsync(async (req, res, next) => {
  const { foods } = req;

  await foods.update({ status: 'disabled' });

  res.status(201).json({
    status: 'success',
    message: 'la comida fue eliminada',
  });
});
