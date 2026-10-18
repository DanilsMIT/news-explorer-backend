const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getCurrentUser,
  getUsers,
  getUserById,
} = require("../controllers/users");

router.get("/me", getCurrentUser);
router.get("/", getUsers);
router.get(
  "/:userId",
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24).required(),
    }),
  }),
  getUserById,
);

module.exports = router;
