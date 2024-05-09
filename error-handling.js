exports.handleErrors = (error, request, response, next) => {
  if (error.status && error.message) {
    response.status(error.status).send({ message: error.message });
  }
  next(error);
};

exports.handleServerErrors = (error, request, response, next) => {
  response
    .status(500)
    .send({ message: "An internal server error has occurred" });
};
