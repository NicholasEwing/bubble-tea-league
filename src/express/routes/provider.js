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
    // If testing locally, convert the body from a buffer to a string
    let { body } = req;
    if (process.env.NODE_ENV === "local") {
      body = JSON.parse(body.toString());
    }

    // make sure a provider isn't already in the database
    // unless we're initially resetting with `reset: true`
    const providerIds = await models.Provider.findAll();

    if (!body.reset && providerIds.length) {
      res
        .status(409)
        .send(
          "A provider ID already exists in the database. Use 'reset: true' in the body to hard reset the Providers table."
        );
    } else {
      await models.Provider.sync({ force: true }); // delete all Provider records just in case

      // TODO: make sure provider ID stores correctly
      const providerId = await createProviderId();

      // TODO: Probably validate that we get a single number or something here
      // so we don't create a Provider with null or a weird value

      // Create Provider record with new ID
      await models.Provider.create({ providerId });
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
