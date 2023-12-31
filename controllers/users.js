const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const BadRequestError = require('../utils/errors/BadRequestError'); // 400
const NotFoundError = require('../utils/errors/NotFoundError'); // 404
const ConflictError = require('../utils/errors/ConflictError'); // 409

const { NODE_ENV, JWT_SECRET = 'JWT_SECRET' } = process.env;

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Введены некорректные данные'));
      }
      if (err.code === 11000) {
        return next(
          new ConflictError('Пользователь с данным email уже существует'),
        );
      }
      return next(err);
    });
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { email, name } = req.body;
  userModel
    .findByIdAndUpdate(
      userId,
      { email, name },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ user });
      // res.send({
      //   id: user.id,
      //   email,
      //   name,
      // });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError('Введены некорректные данные'),
        );
      }
      return next(err);
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
        expiresIn: '7d',
      });
      return res.send({ token });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  userModel.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  updateUser,
  loginUser,
  getCurrentUser,
};
