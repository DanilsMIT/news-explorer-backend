const winston = require("winston");
const expressWinston = require("express-winston");

const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: "request.log" })],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: "error.log" })],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};

//Registra en archivos de texto todas las peticiones que recibe la API y los errores que ocurren en el servidor.
