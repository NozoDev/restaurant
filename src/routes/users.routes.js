const usersController = require('../controllers/users.controller');

// middlewares
const validationsMiddleware = require('../middlewares/validation.middlewares');
const authMiddleware = require('../middlewares/auth.middleware');
const usersMiddleware = require('../middlewares/users.middlewares');

const { Router } = require('express');
const router = Router();

router.post(
  '/signup',
  validationsMiddleware.createUserValidation,
  usersController.signup
);

router.post(
  '/login',
  validationsMiddleware.loginUserValidation,
  usersController.login
);

router.use(authMiddleware.protect);

router.get(
  '/orden',
  usersMiddleware.validSessionUser,
  usersController.OrdenUser
);

router.get(
  '/orden/:id',
  usersMiddleware.validSessionUser,
  usersController.OneOrden
);

router.use('/:id', usersMiddleware.validUser);

router
  .use(authMiddleware.protectAccount)
  .route('/:id')
  .patch(validationsMiddleware.updateUserValidation, usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
