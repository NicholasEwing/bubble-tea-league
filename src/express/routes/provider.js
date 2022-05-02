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
      await models.Provider.sync({ force: true }); // delete all Provider records just in case
      const riotGamesApiKey = req.headers["x-riot-token"];

      // TODO: make sure provider ID stores correctly
      const providerId = await createProviderId(riotGamesApiKey);

      // TODO: Probably validate that we get a single number or something here
      // so we don't create a Provider with null or a weird value

      // Create Provider record with new ID
      await models.Provider.create({ providerId });
      res.status(201).send();
    }
  } catch (error) {
    console.log(error);
    res.status(404).send(error.message);
  }
}

module.exports = {
  getAll,
  create,
};
