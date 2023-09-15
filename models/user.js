// файл со схемой для юзера в базе данных и экспортом модели по данной схеме
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Светлана',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (stringFromUser) => validator.isEmail(stringFromUser),
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // чтобы API не возвращал хеш пароля
  },
});

// в случае аутентификации хеш пароля нужен. Чтобы это реализовать, после вызова метода модели,
// нужно добавить вызов метода select, передав ему строку +password:
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((currentUser) => {
      if (!currentUser) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, currentUser.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return currentUser;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
