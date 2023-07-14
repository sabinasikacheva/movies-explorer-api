const movieModel = require('../models/movie');
const BadRequestError = require('../utils/errors/BadRequestError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ForbiddenError = require('../utils/errors/ForbiddenError');

const getAllMovies = (req, res, next) => {
  movieModel
    .find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  movieModel
    .create({
      owner: req.user._id,
      ...req.body,
    })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError(
            'Введены некорректные данные',
          ),
        );
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  movieModel
    .findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет прав для удаления фильма');
      }
      movieModel.findByIdAndRemove(req.params.movieId)
        .then((deletedMovie) => res.send(deletedMovie))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректный запрос'));
      }
      return next(err);
    });
};
module.exports = {
  getAllMovies,
  createMovie,
  deleteMovie,
};
