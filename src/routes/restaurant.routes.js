const restaurantController = require('../controllers/restaurant.controllers');

// middlewares
const validationMiddleware = require('../middlewares/validation.middlewares');
const authMiddleware = require('../middlewares/auth.middleware');
const restaurantMiddleware = require('../middlewares/restaurant.middleware');

const { Router } = require('express');
const router = Router();

router
  .route('/')
  .get(restaurantController.findRestaurant)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    validationMiddleware.createRestaurantValidation,
    restaurantController.newRestaurant
  );

router
  .route('/reviews/:restaurantId/:id')
  .patch(
    authMiddleware.protect,
    authMiddleware.protectAccountByReview,
    validationMiddleware.reviewValidation,
    restaurantMiddleware.validReview,
    restaurantController.updateReview
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.protectAccountByReview,
    restaurantMiddleware.validReview,
    restaurantController.deleteReview
  );

router.post(
  '/reviews/:id',
  authMiddleware.protect,
  validationMiddleware.reviewValidation,
  restaurantMiddleware.validRestaurant,
  restaurantController.newReview
);

router.use('/:id', restaurantMiddleware.validRestaurant);

router
  .route('/:id')
  .get(restaurantController.findRestaurantById)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    validationMiddleware.updateRestaurantValidation,
    restaurantController.updateRestaurant
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    restaurantController.deleteRestaurant
  );

module.exports = router;