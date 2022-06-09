const sequelize = require("../../sequelize");
const { MatchRound, Player, MatchRoundTeamStats, MatchRoundPlayerStats } =
  sequelize.models;
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
      const hasStatusCode = !!matchRoundResults?.status?.status_code;

      let statusCode;
      if (hasStatusCode) {
        statusCode = matchRoundResults?.status?.status_code;
      }

      if (hasStatusCode && (statusCode < 200 || statusCode >= 300)) {
        throw new Error(
          `Error from Riot Games API. Received status code ${statusCode}`
        );
      }

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

      // Parse team info into a matchRoundTeamStats object
      // and store that in our database for each team using matchRoundResults

      // Parse winner info
      const winnerInfo = matchRoundResults.info.teams.find((team) => team.win);
      const winningTeamGoldEarned = matchRoundResults.info.participants
        .filter((p) => p.win)
        .reduce((g, w) => (g += w.goldEarned), 0);

      const matchRoundTeamStatsWinner = {
        kills: winnerInfo.objectives.champion.kills,
        goldEarned: winningTeamGoldEarned,
        towersDestroyed: winnerInfo.objectives.tower.kills,
        heraldsKilled: winnerInfo.objectives.riftHerald.kills,
        dragonsKilled: winnerInfo.objectives.dragon.kills,
        MatchRoundId,
        TeamId: winningTeamId,
      };

      // Parse loser info
      const loserInfo = matchRoundResults.info.teams.find(
        (team) => team.win === false
      );

      const losingTeamGoldEarned = matchRoundResults.info.participants
        .filter((p) => p.win === false)
        .reduce((g, l) => (g += l.goldEarned), 0);

      const matchRoundTeamStatsLoser = {
        kills: loserInfo.objectives.champion.kills,
        goldEarned: losingTeamGoldEarned,
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
      // ^^^^^^^ this works, comment it out for now to avoid dups!!! ^^^^^^

      // Parse and store this game's stats for each player
      const allPlayers = [...winningPlayers, ...losingPlayers];
      const parsePlayers = (allPlayers, MatchRoundId) => {
        const matchRoundPlayerStatsRecords = allPlayers.map((player) => {
          // match PUUID with participant
          const participant = matchRoundResults.info.participants.find(
            (p) => p.puuid === player.PUUID
          );

          const primaryRuneInfo = participant.perks.styles.find(
            (s) => s.description === "primaryStyle"
          );
          const secondaryRuneInfo = participant.perks.styles.find(
            (s) => s.description === "subStyle"
          );

          const matchRoundPlayerStatsObj = {
            kills: participant.kills,
            deaths: participant.deaths,
            assists: participant.assists,
            goldEarned: participant.goldEarned,
            champLevel: participant.champLevel,
            championName: participant.championName,
            championTransform: participant.championTransform,
            champLevel: participant.champLevel,
            item0: participant.item0,
            item1: participant.item1,
            item2: participant.item2,
            item3: participant.item3,
            item4: participant.item4,
            item5: participant.item5,
            item6: participant.item6,
            summoner1Id: participant.summoner1Id,
            summoner2Id: participant.summoner2Id,
            role: participant.role,
            totalMinionsKilled: participant.totalMinionsKilled,
            visionScore: participant.visionScore,
            statPerks: JSON.stringify(participant.perks.statPerks),
            primaryRunePath: primaryRuneInfo.style,
            primaryRunePerks: JSON.stringify(primaryRuneInfo.selections),
            secondaryRunePath: secondaryRuneInfo.style,
            secondaryRunePerks: JSON.stringify(secondaryRuneInfo.selections),
            summonerName: participant.summonerName,
            PlayerId: player.id,
            MatchRoundId,
          };

          return matchRoundPlayerStatsObj;
        });

        return matchRoundPlayerStatsRecords;
      };

      const matchRoundPlayerStatsRecords = parsePlayers(
        allPlayers,
        MatchRoundId
      );

      // Record all 10 players individual stats for this game
      await MatchRoundPlayerStats.bulkCreate(matchRoundPlayerStatsRecords);
      // ^^^^^^^ this works, comment it out for now to avoid dups!!! ^^^^^^

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
