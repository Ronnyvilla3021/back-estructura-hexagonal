// Middleware para estandarizar respuestas API
// Usado por el frontend de OpenBlind

// Respuesta exitosa
const apiResponse = function(data = null, statusCode = 200, message = '') {
  return this.status(statusCode).json({
    success: true,
    message: message,
    data: data
  });
};

// Respuesta de error
const apiError = function(message = 'Error', statusCode = 500, details = null) {
  return this.status(statusCode).json({
    success: false,
    message: message,
    error: details
  });
};

// Inyectar métodos en el objeto res
const injectApiMethods = (req, res, next) => {
  res.apiResponse = apiResponse;
  res.apiError = apiError;
  next();
};

module.exports = injectApiMethods;
