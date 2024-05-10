const fs = require("fs/promises");

exports.fetchFileById = async (folder, id) => {
  const owner = await fs.readFile(`./data/${folder}/${id}.json`, "utf-8");
  return JSON.parse(owner);
};

exports.fetchAllFileData = async (folder) => {
  const fileNames = await fs.readdir(`./data/${folder}`);
  return await Promise.all(
    fileNames.map((fileName) =>
      this.fetchFileById(folder, fileName.split(".")[0])
    )
  );
};

exports.fetchOwnerPetsById = async (id) => {
  const allPetData = await this.fetchAllFileData("pets");
  const petsOfOwner = allPetData.filter(({ owner }) => owner === id);
  return petsOfOwner.sort((a, b) => a.id.slice(1) - b.id.slice(1));
};
