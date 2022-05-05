const { models } = require("../../sequelize");
const { getIdParam, generateTournamentCodes } = require("../helpers");

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
      // teamOne / teamTwo should reference ids from the Teams table
      const { season, bestOf } = req.body;

      const { tournamentId } = await models.Season.findByPk(season, {
        raw: true,
      });

      // create fake match to get matchId
      const matchObj = {
        season,
      };

      const match = await models.Match.create(matchObj);
      const matchId = match.dataValues.id;

      // create X number of fake match rounds
      // and associate them with the new matchId
      const tournamentCodes = await generateTournamentCodes(
        season,
        bestOf,
        tournamentId,
        matchId
      );

      // For every code, make a match round and slap a tourny code on it
      tournamentCodes.forEach(async (tournamentCode) => {
        const matchRoundObj = {
          MatchId: matchId,
          tournamentCode,
        };

        await MatchRound.create(matchRoundObj);
      });

      res.status(201).end();
    }
  } catch (error) {
    console.error(error);
    res.status(404).send(error.message);
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
    await models.Match.destroy({
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
