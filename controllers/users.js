const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
// импорт модели user, сделанной по схеме userSchema
const User = require('../models/user');

const BadRequestError = require('../utils/errors/BadRequestError'); // 400
const NotFoundError = require('../utils/errors/NotFoundError'); // 404
const ConflictError = require('../utils/errors/ConflictError'); // 409

// Регистрация юзера (в ответе возвращаем весь объект User кроме пароля)
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  // Хэширование пароля
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => res.status(201).send({
      name, email,
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь уже существует'));
      } else { next(err); }
    });
};

// Авторизация
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((currentUser) => {
      // генерация токена
      const token = jwt.sign(
        { _id: currentUser._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'token-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => next(err));
};

// Обновить профиль юзера
// Параметр { new: true }, чтобы ответ возвращал обновленные данные
// Параметр {runValidators: true} запустит валидацию схемы при обновлении данных
const updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((updatedUserData) => res.status(200).send(updatedUserData))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь не найден'));
      } else { next(err); }
    });
};

// Получить профиль юзера
const getUserProfile = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((currentUser) => {
      res.status(200).send(currentUser); // { data: currentUser }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Некорректный id'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser, updateUserProfile, login, getUserProfile,
};
