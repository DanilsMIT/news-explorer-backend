const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getArticles,
  postArticle,
  deleteArticle,
} = require("../controllers/articles");

// Articulos guardados
router.get("/", getArticles);

// Guardar un artículo nuevo
router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string().uri().required(),
      image: Joi.string().uri().required(),
    }),
  }),
  postArticle,
);

// Borrar un artículo
router.delete(
  "/:articleId",
  celebrate({
    params: Joi.object().keys({
      articleId: Joi.string().hex().length(24).required(), // Valida que el ID tenga formato de MongoDB
    }),
  }),
  deleteArticle,
);

module.exports = router;
