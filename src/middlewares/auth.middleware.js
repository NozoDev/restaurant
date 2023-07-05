const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Users = require('../models/users.model');
const Reviews = require('../models/review.model');
const Ordens = require('../models/orden.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(
        'Usted no se ha identificado! Por favor inicie sesión para obtener acceso',
        401
      )
    );
  }

  const decod = await promisify(jwt.verify)(token, process.env.SECRET_JWT_SEED);

  const user = await Users.findOne({
    where: {
      id: decod.id,
      status: 'active',
    },
  });

  if (!user) {
    return next(
      new AppError('El propietario de este token ya no está activo', 401)
    );
  }

  req.sessionUser = user;
  next();
});

exports.protectAccount = catchAsync(async (req, res, next) => {
  const { user, sessionUser } = req;

  if (user.id !== sessionUser.id) {
    return next(new AppError('No eres dueño de esta cuenta.', 401));
  }

  next();
});

exports.protectAccountByReview = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params;

  const review = await Reviews.findOne({
    where: { id },
  });

  if (review.userId !== sessionUser.id) {
    return next(new AppError('No eres dueño de esta cuenta.', 401));
  }

  next();
});

exports.protectAccounByOrden = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params;

  const orden = await Ordens.findOne({
    where: { id },
  });

  if (orden.userId !== sessionUser.id) {
    return next(new AppError('No eres dueño de esta cuenta.', 401));
  }

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.sessionUser.role)) {
      return next(
        new AppError('No tienes permiso para realizar esta acción.!', 403)
      );
    }

    next();
  };
};
