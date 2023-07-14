const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const usersController = require('../controllers/users');
const auth = require('../middlewares/auth');
const {
  validationUserRegister,
  validationUserAuth,
} = require('../middlewares/validation');
const NotFoundError = require('../utils/errors/NotFoundError');

router.post('/signup', validationUserRegister, usersController.createUser);
router.post('/signin', validationUserAuth, usersController.loginUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

module.exports = router;
