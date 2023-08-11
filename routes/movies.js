const router = require('express').Router();
const moviesController = require('../controllers/movies');
const {
  // validationCreateMovie,
  validationIdMovie,
} = require('../middlewares/validation');

router.get('/', moviesController.getAllMovies);
router.post('/', moviesController.createMovie);
router.delete('/:movieId', validationIdMovie, moviesController.deleteMovie);

module.exports = router;
