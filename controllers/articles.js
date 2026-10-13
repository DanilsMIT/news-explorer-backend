const Article = require("../models/article");
const {
  BadRequestError,
  notFoundError,
  ForbiddenError,
} = require("../errors/responseErrors");

// Get articles (Solo los del usuario logueado)
const getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).send({ data: articles });
  } catch (err) {
    return next(err);
  }
};

// Save Article
const postArticle = async (req, res, next) => {
  try {
    const { keyword, title, text, date, source, link, image } = req.body;
    const owner = req.user._id;
    const article = await Article.create({
      keyword,
      title,
      text,
      date,
      source,
      link,
      image,
      owner,
    });
    res.status(201).send({ data: article });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(
        new BadRequestError("Datos inválidos al guardar el artículo"),
      );
    } else {
      return next(err);
    }
  }
};

// Delete Article
const deleteArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const article = await Article.findById(articleId).select("+owner");

    if (!article) {
      return next(new notFoundError());
    }

    if (article.owner.toString() !== req.user._id) {
      return next(new ForbiddenError());
    }

    await Article.findByIdAndDelete(articleId);
    res.status(200).send({ data: article });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("ID de artículo no válido"));
    } else {
      return next(err);
    }
  }
};

module.exports = { getArticles, postArticle, deleteArticle };
