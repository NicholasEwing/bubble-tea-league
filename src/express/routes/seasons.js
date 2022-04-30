// each season is a "tournament" in terms of the Riot Games API
const { models } = require("../../sequelize");
const { getIdParam, createTournament } = require("../helpers");

async function getAll(req, res) {
  try {
    const seasons = await models.Season.findAll();
    res.status(200).json(seasons);
  } catch (error) {
    res.status(404).send(error);
  }
}

async function getById(req, res) {
  try {
    const id = getIdParam(req);
    const season = await models.Season.findByPk(id);
    res.status(200).json(season);
  } catch (error) {
    res.status(404).send(error);
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
      // Hit Riot Games API to create a "tournament" for the Season
      const result = await models.Provider.findAll({ raw: true });
      if (!result.length)
        throw new Error(
          "No providers registered. Please register a provider before creating a Season."
        ); // if no providers, short-circuit

      const { providerId } = result[0];

      const tournamentId = await createTournament(providerId);

      // TODO: Make sure season has a number associated with it for BTL.
      // Start at 8 and auto-increment and use that as primary key
      await models.Season.create({ tournamentId });
      res.status(201).end();
    }
  } catch (error) {
    console.log("Error inside seasons");
    res.status(404).send(error);
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
    res.status(404).send(error);
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
    res.status(404).send(error);
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
