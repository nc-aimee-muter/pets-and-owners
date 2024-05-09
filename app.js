const express = require("express");
const app = express();

const {
  allOtherEndpoints,
  getApiInfo,
} = require("./controllers/api-controllers");
const { getOwnerById } = require("./controllers/owners-controllers");
const { handleErrors, handleServerErrors } = require("./error-handling");

app.get("/api", getApiInfo);

app.get("/api/owners/:id", getOwnerById);

app.all("*", allOtherEndpoints);

app.use(handleErrors);
app.use(handleServerErrors);

module.exports = app;
