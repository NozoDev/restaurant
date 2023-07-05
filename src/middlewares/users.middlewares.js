const Users = require('../models/users.model');
const Restaurant = require('../models/restaurant.model');
const Food = require('../models/food.model');
const Orden = require('../models/orden.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await Users.findOne({
    where: {
      id,
      status: 'active',
    },
  });

  if (!user) {
    return next(new AppError(`el usuario con el id:${id} no fue encontrado😔`, 404));
  }

  req.user = user;
  next();
});

exports.validSessionUser = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const user = await Users.findOne({
    where: {
      id: sessionUser.id,
      status: 'active',
    },
    include: [
      {
        model: Orden,
        attributes: {
          exclude: ['foodId', 'userId', 'status', 'updatedAt', 'createdAt'],
        },
        include: [
          {
            model: Food,
            attributes: {
              exclude: [
                'status',
                'restaurantId',
                'userId',
                'updatedAt',
                'createdAt',
              ],
            },
            include: [
              {
                model: Restaurant,
                attributes: {
                  exclude: ['status', 'updatedAt', 'createdAt'],
                },
              },
            ],
          },
        ],
      },
    ],
  });

  if (!user) {
    return next(new AppError(`No se encontró el usuario con id:${id}`, 404));
  }

  req.user = user;
  next();
});
