const router = require('express').Router();
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { validateLogin, validateCreateUser } = require('../middlewares/celebrateValidation');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../utils/errors/NotFoundError');

// Регистрация и логин (с валидацией Celebrate)
router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

// users указывает на базовый путь для всех маршрутов,
// определенных внутри userRouter из файла routes/users.js
// auth - middleware для авторизации
router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);
router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

module.exports = router;
