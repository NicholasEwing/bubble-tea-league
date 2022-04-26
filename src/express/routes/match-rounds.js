const { models } = require("../../sequelize");
const { getIdParam } = require("../helpers");

async function getAll(req, res) {
  try {
    const matchRounds = await models.MatchRound.findAll();
    res.status(200).json(matchRounds);
  } catch (error) {
    res.status(404).send(error);
  }
}

async function getById(req, res) {
  try {
    const id = getIdParam(req);
    const matchRound = await models.MatchRound.findByPk(id);
    res.status(200).json(matchRound);
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
      // TODO: associate a match id with this round before creating the round
      // however, upon creating the tourny code the match needs to be created
      // in the db so that there is ALWAYS a match associated with some tourny codes
      await models.MatchRound.create(req.body);
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
      await models.MatchRound.update(req.body, {
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
    await models.MatchRound.destroy({
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
