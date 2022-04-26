// each season is a "tournament" in terms of the Riot Games API
const { models } = require("../../sequelize");
const { getIdParam } = require("../helpers");

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
      // TODO: Create a new tournament via Riot Games API when a new season starts
      await models.Season.create(req.body);
      res.status(201).end();
    }
  } catch (error) {
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
