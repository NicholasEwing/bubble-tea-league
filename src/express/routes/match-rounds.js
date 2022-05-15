const sequelize = require("../../sequelize");
const { MatchRound, Player, MatchRoundTeamStats } = sequelize.models;
const { getIdParam, findTeamIdsFromMatchResults } = require("../helpers");
const { default: fetch } = require("node-fetch");

async function getAll(req, res) {
  try {
    const matchRounds = await MatchRound.findAll();
    res.status(200).json(matchRounds);
  } catch (error) {
    res.status(404).send(error);
  }
}

async function getById(req, res) {
  try {
    const id = getIdParam(req);
    const matchRound = await MatchRound.findByPk(id);
    res.status(200).json(matchRound);
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
      const matchResults = req.body;
      const teamIds = await findTeamIdsFromMatchResults(matchResults);

      const { winningTeamId, losingTeamId } = teamIds;
      const { metaData, gameId } = matchResults;
      const matchRoundObj = {
        gameId,
        winningTeamId,
        losingTeamId,
        metaData,
      };

      // Update the match round in our database and find it
      // using the tournament code Riot Games gave us in the callback
      const tournamentCode = matchResults.shortCode;
      const matchRound = await MatchRound.update(matchRoundObj, {
        where: {
          tournamentCode,
        },
      });

      const MatchRoundId = matchRound[0]; // our db returns an array with just the id of the row

      const winningPlayers = await Player.findAll({
        where: {
          TeamId: winningTeamId,
        },
      });

      const losingPlayers = await Player.findAll({
        where: {
          TeamId: losingTeamId,
        },
      });

      // TODO: Hit the match v5 API with the gameId that Riot gave us

      // Here's how we'd ACTUALLY hit it, but Riot doesn't give us fake match v5 responses...
      // so we're going to edit the response we get from Riot

      // Random ranked game I played
      const testGameId = `NA1_${4304210544}`;

      const riotGamesResponse = await fetch(
        `https://americas.api.riotgames.com/lol/match/v5/matches/${testGameId}`,
        {
          headers: {
            "X-Riot-Token": process.env.RIOT_GAMES_API_KEY,
          },
        }
      );
      const matchRoundResults = await riotGamesResponse.json();

      // this is all temp stuff to make it look like we're getting valid match v5 results----------

      const winningPUUIDs = winningPlayers.map((player) => player.PUUID);
      const losingPUUIDs = losingPlayers.map((player) => player.PUUID);
      const newParticipants = [...winningPUUIDs, ...losingPUUIDs];

      // Replace metadata player info
      const { participants } = matchRoundResults.metadata;
      participants.splice(0, participants.length, ...newParticipants); // manually replace participants

      // Replace individual player info
      const infoParticipants = matchRoundResults.info.participants; // this is an array of objects
      infoParticipants.forEach((player, i) => {
        player.puuid = newParticipants[i];
      });
      // --------- end of temp fake stuff

      // TODO: Parse team info into a matchRoundTeamStats object
      // and store that in our database for each team using matchRoundResults

      // Parse winner info
      const winnerInfo = matchRoundResults.info.teams.filter(
        (team) => team.win
      )[0];

      const matchRoundTeamStatsWinner = {
        kills: winnerInfo.objectives.champion.kills,
        goldEarned: 0, //TODO: Do math from players goldEarned and add this later
        towersDestroyed: winnerInfo.objectives.tower.kills,
        heraldsKilled: winnerInfo.objectives.riftHerald.kills,
        dragonsKilled: winnerInfo.objectives.dragon.kills,
        MatchRoundId,
        TeamId: winningTeamId,
      };

      // Parse loser info
      const loserInfo = matchRoundResults.info.teams.filter(
        (team) => team.win === false
      )[0];

      const matchRoundTeamStatsLoser = {
        kills: loserInfo.objectives.champion.kills,
        goldEarned: 0, //TODO: Do math from players goldEarned and add this later
        towersDestroyed: loserInfo.objectives.tower.kills,
        heraldsKilled: loserInfo.objectives.riftHerald.kills,
        dragonsKilled: loserInfo.objectives.dragon.kills,
        MatchRoundId,
        TeamId: losingTeamId,
      };

      const matchRoundTeamStatsRecords = [
        matchRoundTeamStatsWinner,
        matchRoundTeamStatsLoser,
      ];

      // Add team stats for winner / losing into db
      await MatchRoundTeamStats.bulkCreate(matchRoundTeamStatsRecords);

      res.status(201).end();
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
}

async function update(req, res) {
  try {
    const id = getIdParam(req);

    // We only accept an UPDATE request if the `:id` param matches the body `id`
    if (req.body.id === id) {
      await MatchRound.update(req.body, {
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
    await MatchRound.destroy({
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
