const { createProviderId, createProviderId2 } = require("../helpers");
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

    if (!req.body.reset && providerIds.length) {
      console.log("all providers", providerIds);
      res.status(409).send("A provider ID already exists in the database.");
    } else {
      // TODO: delete all provider records in the db
      const providerId = await createProviderId2();
      await models.Provider.create({ providerId: providerId });
      res.status(201).send();
    }
  } catch (error) {
    console.log("Reach an error in POST /api/provider");
    console.log(error);
    res.status(404).send();
  }
}

module.exports = {
  getAll,
  create,
};
