// each season is a "tournament" in terms of the Riot Games API
const { models } = require("../../sequelize");
const { getIdParam, createTournament } = require("../helpers");

async function getAll(req, res) {
  try {
    const seasons = await models.Season.findAll();
    res.status(200).json(seasons);
  } catch (error) {
    res.status(404).send(error.message);
  }
}

async function getById(req, res) {
  try {
    const id = getIdParam(req);
    const season = await models.Season.findByPk(id);
    res.status(200).json(season);
  } catch (error) {
    res.status(404).send(error.message);
  }
}

async function create(req, res) {
  try {
    if (req.body.id) {
      res
        .status(400)
        .send(
          `Bad request: ID should not be provided, since it is determined automatically by the database.`
        );
    } else {
      // Ensure we have only one provider record
      const providers = await models.Provider.findAll();
      if (!providers.length === 1)
        throw new Error(
          "No providers registered. Please register a provider before creating a Season."
        );

      const { number } = req.body; // assign season #
      const { providerId } = providers[0];
      // Hit Riot Games API to create a "tournament" for the Season
      const tournamentId = await createTournament(providerId);

      await models.Season.create({ number, tournamentId });
      res.status(201).send({ tournamentId });
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

async function update(req, res) {
  try {
    const id = getIdParam(req);

    // We only accept an UPDATE request if the `:id` param matches the body `id`
    if (req.body.id === id) {
      await models.Match.update(req.body, {
        where: {
          id: id,
        },
      });
      res.status(200).end();
    } else {
      res
        .status(400)
        .send(
          `Bad request: param ID (${id}) does not match body ID (${req.body.id}).`
        );
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
}

async function remove(req, res) {
  try {
    const id = getIdParam(req);
    await models.Season.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).end();
  } catch (error) {
    res.status(404).send(error.message);
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
