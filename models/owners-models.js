const fs = require("fs/promises");

exports.fetchOwnerById = async (id) => {
  const owner = await fs.readFile(`./data/owners/${id}.json`);
  return JSON.parse(owner);
};
