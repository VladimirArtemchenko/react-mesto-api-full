const bcrypt = require('bcryptjs');

const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-error');

module.exports.findUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (user) {
        res.status(200)
          .send({ data: user });
      }
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан невалидный id'));
      } else {
        next(err);
      }
    });
};

module.exports.findUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200)
      .send({ data: users }))
    .catch(next);
};

module.exports.findUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (user) {
        res.status(200)
          .send({ data: user });
      }
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан невалидный id'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  User.find({ email })
    .then((user) => {
      console.log(user);
      console.log(user !== []);
      if (user.length !== 0) {
        console.log(user);
        res.status(200);
        next(new ConflictError('Пользователь с таким e-mail уже существует'));
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name,
            about,
            email,
            avatar,
            password: hash,
          }))
          .then(() => res.status(200)
            .send({
              data: {
                name,
                about,
                avatar,
                email,
              },
            }))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
            } else {
              next(err);
            }
          });
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const {
    name,
    about,
  } = req.body;

  User.findByIdAndUpdate(req.user._id, {
    name,
    about,
  }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        res.status(200)
          .send({ data: user });
      }
      throw new NotFoundError('Пользователь с указанным _id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        res.status(200)
          .send({ data: user });
      }
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Передан неверный логин или пароль');
      }

      return bcrypt.compare(password, user.password)

        // eslint-disable-next-line consistent-return
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Передан неверный логин или пароль');
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'VladimirArtemchenko',
            { expiresIn: '7d' },
          );
          res.send({ token });
        })
        .catch(next);
    })
    .catch(next);
};
