const fs = require("fs/promises");

exports.fetchOwnerById = async (id) => {
  const owner = await fs.readFile(`./data/owners/${id}.json`, "utf-8");
  return JSON.parse(owner);
};

exports.fetchOwners = async () => {
  const ownerFileNames = await fs.readdir("./data/owners");

  return await Promise.all(
    ownerFileNames.map((ownerFileName) =>
      this.fetchOwnerById(ownerFileName.split(".")[0])
    )
  );
};
