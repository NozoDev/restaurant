const Users = require('../models/users.model');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');
const AppError = require('../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const users = await Users.findOne({
    where: {
      email,
    },
  });

  if (users) {
    return res.status(404).json({
      status: 'error',
      message: `Ya hay un usuario creado en la base de datos con el correo: ${email}`,
    });
  }

  const user = await Users.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password,
    role,
  });

  const token = await generateJWT(user.id);

  res.status(201).json({
    message: ' Usuario creado con exito!',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await Users.findOne({
    where: {
      email: email.toLowerCase(),
      status: 'active',
    },
  });

  if (!user) {
    return next(
      new AppError(`el usuario con email:${email} no fue encontrado !`, 404)
    );
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError(`contraseña o correo equivocado`, 401));
  }

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'exitoso',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.OrdenUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({
    status: 'success',
    results: user.orden.length,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    orden: user.orden,
    food: user.meals,
    restaurant: user.restaurant,
  });
});

exports.OneOrden = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  const filOrden = user.orden.filter((orden) => orden.id === +id);

  if (filOrden.length === 0) {
    return next(new AppError(`el pedido con id:${id} no existe `));
  }

  res.status(200).json({
    status: 'success',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    orden: filOrden,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, email } = req.body;

  await user.update({ name, email });

  res.status(200).json({
    status: 'exitoso',
    message: `el usuario con id:${user.id} fue actualizado`,
    user: {
      name,
      email,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'disabled' });

  res.status(200).json({
    status: 'exitoso',
    message: `usuario con el id:${user.id} ha sido eliminado`,
  });
});
