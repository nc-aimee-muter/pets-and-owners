const {
  allOtherEndpoints,
  getApiInfo,
} = require("./controllers/api-controllers");
const { getOwnerById } = require("./controllers/owners-controllers");
const { makeRainbow, styleError } = require("./utils/utils");

module.exports = {
  allOtherEndpoints,
  getApiInfo,
  makeRainbow,
  styleError,
  getOwnerById,
};
