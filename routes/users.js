const router = require('express').Router();
const usersController = require('../controllers/users');
const {
  validationUpdateUser,
} = require('../middlewares/validation');

router.get('/me', usersController.getCurrentUser);
router.patch('/me', validationUpdateUser, usersController.updateUser);

module.exports = router;
