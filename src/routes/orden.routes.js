const ordenController = require('../controllers/orden.controllers');

// middlewares
const validationsMiddleware = require('../middlewares/validation.middlewares');
const authMiddleware = require('../middlewares/auth.middleware');
const ordenMiddleware = require('../middlewares/orden.middleware');

const { Router } = require('express');
const router = Router();

router.use(authMiddleware.protect);

router.post(
  '/',
  validationsMiddleware.ordenValidation,
  ordenController.createOrden
);

router.get('/me', ordenController.findOrden);

router
  .use('/:id', authMiddleware.protectAccounByOrden, ordenMiddleware.validOrden)
  .route('/:id')
  .patch(ordenController.updateOrden)
  .delete(ordenController.deleteOrden);

module.exports = router;
