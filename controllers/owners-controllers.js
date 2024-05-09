const { fetchOwnerById, fetchOwners } = require("../models/owners-models");

exports.getOwnerById = async (request, response, next) => {
  const id = request.params.id.toLowerCase();
  if (!/^o{1}[0-9]+$/.test(id)) {
    next({
      status: 400,
      message: "Invalid ID",
    });
  }

  try {
    const owner = await fetchOwnerById(id);
    response.status(200).send({ owner });
  } catch (error) {
    next({
      status: 404,
      message: "No owner matching the provided ID",
    });
  }
};

exports.getOwners = async (request, response, next) => {
  const owners = await fetchOwners();
  response.status(200).send({ owners });
};
