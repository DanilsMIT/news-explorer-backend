const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: { validator: (v) => validator.isEmail(v) },
  },
  password: { type: String, minlength: 8, required: true, select: false },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "User",
    required: true,
  },
});

//metodo de validación de logeo
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      //email incorrecto
      if (!user) {
        return Promise.reject(new Error("Correo o contraseña inválidos"));
      }
      //password incorrecto
      return bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
          return Promise.reject(new Error("Correo o contraseña inválidos"));
        }
        // todo correcto
        return user;
      });
    });
};
