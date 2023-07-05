const Restaurant = require('../models/restaurant.model');
const Food = require('../models/food.model');
const Orden = require('../models/orden.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validOrden = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const ordenCompleted = await Orden.findOne({
    where: {
      id,
      status: 'completed',
    },
  });

  if (ordenCompleted) {
    return next(
      new AppError(`The order with id:${id} has already been completed.`)
    );
  }

  const orden = await Orden.findOne({
    where: {
      id,
      status: 'active',
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'status'],
    },
    include: [
      {
        model: Food,
        include: [
          {
            model: Restaurant,
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'status'],
            },
          },
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'status'],
        },
      },
    ],
  });

  if (!orden) {
    return next(new AppError(`No se encontró el pedido con id:${id} 😔`, 404));
  }

  req.orden = orden;
  next();
});
