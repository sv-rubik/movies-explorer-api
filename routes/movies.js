const movieRouter = require('express').Router();

const {
  getMoviesList, createMovie, deleteMovieByID,
} = require('../controllers/movies');

const {
  validateCreateMovie,
  validateMovieID,
} = require('../middlewares/celebrateValidation');

// require('./routes/cards') в файле app.js указывает на файл movies.js в папке routes.
// Поэтому, когда внутри movies.js определяем маршруты,
// начинающиеся с /cards, мы уже находимся в контексте этого подпути и в path не нужен '/cards'
movieRouter.get('/', getMoviesList); // GET запрос будет обращаться к http://localhost:3000/cards
movieRouter.post('/', validateCreateMovie, createMovie); // POST запрос будет обращаться к http://localhost:3000/cards
movieRouter.delete('/:movieId', validateMovieID, deleteMovieByID); // запрос на удаление карточки будет обращаться к http://localhost:3000/cards/1

module.exports = movieRouter;
