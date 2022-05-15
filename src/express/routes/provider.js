const { createProviderId } = require("../helpers");
const { models } = require("../../sequelize");

async function getAll(req, res) {
  try {
    const providerIds = await models.Provider.findAll();
    res.status(200).json(providerIds);
  } catch (error) {
    res.status(404).send(error.message);
  }
}

async function create(req, res) {
  try {
    // make sure a provider isn't already in the database
    // unless we're initially resetting with `reset: true`
    const providerIds = await models.Provider.findAll();

    if (!req.body.reset && providerIds.length) {
      res
        .status(409)
        .send(
          "A provider ID already exists in the database. Use 'reset: true' in the body to hard reset the Providers table."
        );
    } else {
      // delete all Provider records so we only have one at all times
      await models.Provider.sync({ force: true });

      // Create Provider record with new ID
      const providerId = await createProviderId();
      await models.Provider.create({ providerId });
      res.status(201).send({ providerId });
    }
  } catch (error) {
    if (error?.parent?.sqlMessage) {
      res.status(404).send(error.parent.sqlMessage);
    } else if (error.message) {
      res.status(404).send(error.message);
    } else {
      res.status(404).send(error);
    }
  }
}

module.exports = {
  getAll,
  create,
};
