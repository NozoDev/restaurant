const foodController = require('../controllers/food.controllers');

const validationsMiddleware = require('../middlewares/validation.middlewares');
const authMiddleware = require('../middlewares/auth.middleware');
const restaurantMiddleware = require('../middlewares/restaurant.middleware');
const foodMiddleware = require('../middlewares/food.middlewares');

const { Router } = require('express');
const router = Router();

router.get('/', foodController.findFood);

router.post(
  '/:id',
  // authMiddleware.protect,
  // authMiddleware.restrictTo('admin'),
  validationsMiddleware.FoodValidation,
  restaurantMiddleware.validRestaurant,
  foodController.newFood
);

router
  .use('/:id', foodMiddleware.validFood)
  .route('/:id')
  .get(foodController.findFoodById)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    validationsMiddleware.FoodValidation,
    foodController.updateFood
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    foodController.deleteFood
  );

module.exports = router;
