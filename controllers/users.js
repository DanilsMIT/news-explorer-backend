const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { NODE_ENV, JWT_SECRET } = process.env;
const {
  BadRequestError,
  UnauthorizedError,
  notFoundError,
  ConflictError,
} = require("../errors/responseErrors");

//AUTH
// Register
const createUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hash,
      name,
    });
    res.status(201).send({
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new ConflictError("El correo ya está registrado"));
    }
    if (err.name === "ValidationError") {
      return next(new BadRequestError());
    }
    return next(err);
  }
};

// Login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === "production" ? JWT_SECRET : "vip-token",
      { expiresIn: "7d" },
    );
    res.send({ token });
  } catch {
    return next(new UnauthorizedError());
  }
};

// Current User (El perfil del usuario logueado)
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new notFoundError());
    }
    res.status(200).send(user);
  } catch (err) {
    return next(err);
  }
};

//Metodos de la db
// Get todos los usuarios
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send({ data: users });
  } catch (err) {
    return next(err);
  }
};

// Get usuario por ID
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(new notFoundError());
    }
    res.status(200).send({ data: user });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("ID de usuario no válido"));
    } else {
      return next(err);
    }
  }
};

module.exports = {
  createUser,
  loginUser,
  getCurrentUser,
  getUsers,
  getUserById,
};
