// импорт модели card, сделанной по схеме cardSchema
const mongoose = require('mongoose');
const Movie = require('../models/movie');

const BadRequestError = require('../utils/errors/BadRequestError'); // 400
const ForbiddenError = require('../utils/errors/ForbiddenError'); // 403
const NotFoundError = require('../utils/errors/NotFoundError'); // 404

// Получить список фильмов
const getMoviesList = (req, res, next) => {
  Movie.find({})
    .then((moviesList) => res.status(200).send(moviesList))
    .catch((err) => next(err));
};

// Создать фильм
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movieData) => res.status(201).send(movieData)) // { data: cardData }
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else { next(err); }
    });
};

// Удалить фильм
const deleteMovieByID = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail()
    .then((currentMovie) => {
      if (!currentMovie) { return next(new NotFoundError('Фильм не найден')); }
      if (!currentMovie.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Удалить можно только свой фильм'));
      }
      return Movie.findByIdAndDelete(req.params.movieId)
        .orFail(() => new NotFoundError('Фильм не найден'))
        .then(() => { res.send({ message: 'Фильм удален' }); });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Передан некорректный ID'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Фильм не найден'));
      } else { next(err); }
    });
};

module.exports = {
  getMoviesList, createMovie, deleteMovieByID,
};
