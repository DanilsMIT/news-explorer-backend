require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { celebrate, Joi, errors } = require("celebrate");
// Middleware Registros de actividad (logs)
const { requestLogger, errorLogger } = require("./middlewares/logger");
// Middleware Auth y registro/login de usuario
const auth = require("./middlewares/auth");
const { createUser, loginUser } = require("./controllers/users");
// Rutas protegidas
const usersRoutes = require("./routes/users");
const articlesRoutes = require("./routes/articles");

const { PORT = 3000, MONGO_URL = "mongodb://localhost:27017/newsExplorer" } =
  process.env;
const app = express();
app.use(cors());
//MongoDB
mongoose.connect(MONGO_URL);
//Body en formato JSON
app.use(express.json());

//Registro solicitudes
app.use(requestLogger);
// Rutas públicas
//Get Noticias
app.get("/search-news", async (req, res, next) => {
  try {
    const { q } = req.query;

    const apiKey = process.env.NEWS_API_KEY;

    const targetUrl = `https://gnews.io/api/v4/search?q=${q}&apikey=${apiKey}&lang=es&max=10`;

    const response = await fetch(targetUrl);

    if (!response.ok) {
      throw new Error(`Error de GNews: ${response.status}`);
    }

    const data = await response.json();
    res.send(data);
  } catch (err) {
    console.error("Error en el puente de noticias:", err);
    res.status(500).send({ message: "Error al buscar noticias" });
  }
});
//Registrarse
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30).required(),
    }),
  }),
  createUser,
);
//Login
app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  loginUser,
);

// Auth
app.use(auth);
// Rutas privadas
app.use("/users", usersRoutes);
app.use("/articles", articlesRoutes);

// Registro de errores Servidor y celebrate
app.use(errorLogger);
app.use(errors());

// Manejo Rutas inexistentes
app.use((req, res) => {
  res.status(404).send({ message: "Recurso no encontrado" });
});

// Manejo Errores del servidor
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).send({
    message:
      statusCode === 500 ? "Ha ocurrido un error en el servidor" : err.message,
  });
  next();
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
