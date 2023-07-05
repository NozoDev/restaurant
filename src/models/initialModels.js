const Users = require('./users.model');
const Food = require('./food.model');
const Orden = require('./orden.model');
const Reviews = require('./review.model');
const Restaurant = require('./restaurant.model');

const initModel = () => {
  Users.hasMany(Orden);
  Orden.belongsTo(Users);

  Users.hasMany(Reviews);
  Reviews.belongsTo(Users);

  Food.hasOne(Orden);
  Orden.belongsTo(Food);

  Restaurant.hasMany(Food);
  Food.belongsTo(Restaurant);

  Restaurant.hasMany(Reviews);
  Reviews.belongsTo(Restaurant);
};

module.exports = initModel;