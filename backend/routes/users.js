const router = require('express')
  .Router();

const {
  celebrate,
  Joi,
} = require('celebrate');

const {
  findUser,
  findUsers,
  findUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const { isValid } = require('../isvalid/isvalid');

router.get('/users/me', findUser);
router.get('/users', findUsers);
router.get('/users/:userId', celebrate({
  params: Joi.object()
    .keys({
      userId: Joi.string()
        .required()
        .length(24)
        .hex(),
    }),
}), findUserById);

router.patch('/users/me', celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      about: Joi.string()
        .required()
        .min(2)
        .max(30),
    }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object()
    .keys({
      avatar: Joi.string()
        .custom(isValid),
    }),
}), updateAvatar);

module.exports = router;
