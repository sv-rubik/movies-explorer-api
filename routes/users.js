const userRouter = require('express').Router();

const {
  updateUserProfile, getUserProfile,
} = require('../controllers/users');

const {
  validateUserProfile,
} = require('../middlewares/celebrateValidation');

// require('./routes/users') в файле index.js указывает на файл users.js в папке routes.
// Поэтому, когда внутри users.js определяем маршруты,
// начинающиеся с /users, мы уже находимся в контексте этого подпути и в path не нужен '/users'
userRouter.get('/me', getUserProfile);
userRouter.patch('/me', validateUserProfile, updateUserProfile);

module.exports = userRouter;
