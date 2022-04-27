const { models } = require("../../sequelize");
const { getIdParam } = require("../helpers");

async function getAll(req, res) {
  try {
    const matches = await models.Match.findAll();
    res.status(200).json(matches);
  } catch (error) {
    res.status(404).send(error);
  }
}

async function getById(req, res) {
  try {
    const id = getIdParam(req);
    const match = await models.Match.findByPk(id);
    res.status(200).json(match);
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
      // Before we make a match in our DB, we need to generate tournament codes for it

      // TODO: Make sure these tournament codes come back correctly
      const tournamentCodes = await generateTournamentCodes(
        3,
        process.env.TEST_TOURNAMENT_ID
      );
      console.log(
        "---------------- WE GOT SOME TOURNAMENT CODES BOIZ ----------------"
      );
      console.log(tournamentCodes);

      // TODO: Put these tourny codes in our DB so we know which codes go to which match
      await models.Match.create(req.body);
      res.status(201).end();
    }
  } catch (error) {
    console.error("OH SHIT");
    console.error(error);
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
    await models.Match.destroy({
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
