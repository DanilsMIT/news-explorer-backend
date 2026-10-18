const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors/responseErrors");
const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError());
  }

  const vipToken = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(
      vipToken,
      NODE_ENV === "production" ? JWT_SECRET : "vip-token",
    );
  } catch (err) {
    return next(new UnauthorizedError());
  }

  req.user = payload;
  next();
};

module.exports = auth;

//Intercepta la petición para validar el token JWT; si es correcto da acceso a la ruta privada, si no, bloquea el paso.
