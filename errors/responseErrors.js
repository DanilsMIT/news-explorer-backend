class BadRequestError extends Error {
  constructor(message = "Datos Inválidos en el formulario") {
    super(message);
    this.statusCode = 400;
  }
}
class UnauthorizedError extends Error {
  constructor(message = "Datos no coinciden o no autorizados") {
    super(message);
    this.statusCode = 401;
  }
}

class ForbiddenError extends Error {
  constructor(message = "Estos datos no te pertenecen") {
    super(message);
    this.statusCode = 403;
  }
}

class notFoundError extends Error {
  constructor(message = "Recurso no encontrado") {
    super(message);
    this.statusCode = 404;
  }
}

class ConflictError extends Error {
  constructor(message = "Datos ya existentes en la base de datos") {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  notFoundError,
  ConflictError,
};
