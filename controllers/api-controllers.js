const apiInfo = require("../endpoints.json");

exports.allOtherEndpoints = (request, response) => {
  response.status(404).send({
    message:
      "This endpoint does not exist... /api provides endpoint information",
  });
};

exports.getApiInfo = (request, response) => {
  response.status(200).send({ apiInfo });
};
