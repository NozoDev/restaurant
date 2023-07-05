const Orden = require('../models/orden.model');
const Food = require('../models/food.model');
const Restaurant = require('../models/restaurant.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createOrden = catchAsync(async (req, res, next) => {
  const { quantity, foodId } = req.body;
  const { id } = req.sessionUser;

  const food = await Food.findOne({
    where: {
      id: foodId,
      status: 'active',
    },
    include: [
      {
        model: Restaurant,
        attributes: {
          exclude: ['status', 'updatedAt', 'createdAt'],
        },
      },
    ],
  });

  if (!food) {
    return next(new AppError('Esa comida no existe', 404));
  }

  const priceTotal = food.price * quantity;

  const order = await Orden.create({
    foodId,
    quantity,
    priceTotal,
    userId: id,
  });

  res.status(201).json({
    status: 'success',
    message: 'La orden fue creada exitosamente!',
    order: {
      id: order.id,
      quantity: order.quantity,
      priceTotal: order.priceTotal,
    },
    food: {
      id: food.id,
      name: food.name,
      price: food.price,
      restaurant: food.restaurant,
    },
  });
});

exports.findOrden = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const orden = await Orden.findAll({
    where: {
      status: 'active',
      userId: sessionUser.id,
    },
    attributes: {
      exclude: ['status', 'foodId', 'userId', 'updatedAt', 'createdAt'],
    },
    include: [
      {
        model: Food,
        include: [
          {
            model: Restaurant,
            attributes: {
              exclude: ['status', 'updatedAt', 'createdAt'],
            },
          },
        ],
        attributes: {
          exclude: [
            'status',
            'restaurantId',
            'userId',
            'updatedAt',
            'createdAt',
          ],
        },
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    results: orden.length,
    orden,
  });
});

exports.updateOrden = catchAsync(async (req, res, next) => {
  const { orden } = req;

  const updatedOrden = await orden.update({ status: 'completed' });
  res.status(200).json({
    status: 'success',
    message: 'La orden se actualizó exitosamente',
    updatedOrden: {
      id: orden.id,
      totalPrice: orden.totalPrice,
      meal: orden.food.name,
      status: orden.status,
    },
  });
});
exports.deleteOrden = catchAsync(async (req, res, next) => {
  const { orden } = req;

  await orden.update({ status: 'cancelled' });
  res.status(201).json({
    status: 'success',
    message: 'la orden fue eliminada',
  });
});
