const sanitizer = require('perfect-express-sanitizer');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

// Manejo de errores :D

const AppError = require('./utils/appError');
const ErrorHandler = require('./controllers/error.controllers');

// Rutas! xd

const usersRouter = require('./routes/users.routes');
const ordenRouter = require('./routes/orden.routes');
const foodRouter = require('./routes/food.routes');
const restaurantRouter = require('./routes/restaurant.routes');

const app = express();
const limiter = rateLimit({
  max: 200000,
  windowMs: 60 * 60 * 10000,
  message: 'Demaciadas solicitudes de IP, intente nuevamente 🚨',
});

//midleware

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(hpp());
app.use(
  sanitizer.clean({
    xss: true,
    noSql: true,
    sql: false,
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1', limiter);

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/orden', ordenRouter);
app.use('/api/v1/restaurant', restaurantRouter);
app.use('/api/v1/food', foodRouter);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`Cant find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(ErrorHandler);

module.exports = app;
