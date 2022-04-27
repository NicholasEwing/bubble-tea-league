const { createProviderId } = require("../helpers");
const { models } = require("../../sequelize");

async function getAll(req, res) {
  try {
    const providerIds = await models.Provider.findAll();
    res.status(200).json(providerIds);
  } catch (error) {
    res.status(404).send(error);
  }
}

async function create(req, res) {
  try {
    // make sure a provider isn't already in the database
    const providerIds = await models.Provider.findAll();

    if (providerIds.length) {
      res.status(409).send("A provider ID already exists in the database.");
    } else {
      const providerId = await createProviderId();
      await models.Provider.create({ providerId });
      res.status(201).send();
    }
  } catch (error) {
    console.log("Reach an error in POST /api/provider");
    console.log(error);
    res.status(404).send(error);
  }
}

module.exports = {
  getAll,
  create,
};
