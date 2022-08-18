const { default: fetch } = require("node-fetch");
const { RateLimiter } = require("limiter");
const { Op } = require("sequelize");
const sequelize = require("../sequelize/index");
const { Match, MatchRound, Team, PlayerTeamHistory, Player } = sequelize.models;

const simulateGroupStageMatches = async (season) => {
  const seasonMatches = await Match.findAll({
    raw: true,
    where: {
      season,
      isPlayoffsMatch: 0,
    },
    attributes: ["id"],
  });

  const seasonMatchIds = seasonMatches.map((m) => m.id);

  const seasonMatchRounds = await MatchRound.findAll({
    raw: true,
    where: {
      tournamentCode: { [Op.not]: null },
      MatchId: {
        [Op.in]: seasonMatchIds,
      },
    },
    attributes: ["tournamentCode", "redTeamId", "blueTeamId"],
  });

  // const seasonTournyCodes = seasonMatchRounds.map((mr) => mr.tournamentCode);

  // for every tournament code, fake a randomized match being complete

  const seasonTeams = await Team.findAll({
    raw: true,
    where: {
      season,
    },
    attributes: ["id"],
  });

  const seasonTeamIds = seasonTeams.map((t) => t.id);

  const seasonHistories = await PlayerTeamHistory.findAll({
    raw: true,
    where: {
      TeamId: {
        [Op.in]: seasonTeamIds,
      },
    },
  });

  const allPlayers = await Player.findAll({
    raw: true,
    attributes: ["id", "summonerName"],
  });

  const limiter = new RateLimiter({
    tokensPerInterval: 1,
    interval: 10000,
  });

  for (const [i, matchRound] of seasonMatchRounds.entries()) {
    const remainingRequests = await limiter.removeTokens(1);

    // grab players from both teams
    const { redTeamId, blueTeamId, tournamentCode } = matchRound;

    // get player history
    const redTeamHistory = seasonHistories.filter(
      (h) => h.TeamId === redTeamId
    );
    const blueTeamHistory = seasonHistories.filter(
      (h) => h.TeamId === blueTeamId
    );

    // find player ids
    const redTeamPlayerIds = redTeamHistory.map((p) => p.PlayerId);
    const blueTeamPlayerIds = blueTeamHistory.map((p) => p.PlayerId);

    // find player objects with all info
    const redTeamPlayers = allPlayers.filter((p) =>
      redTeamPlayerIds.includes(p.id)
    );
    const blueTeamPlayers = allPlayers.filter((p) =>
      blueTeamPlayerIds.includes(p.id)
    );

    // randomly pick which team wins...
    const winningPlayers =
      Math.random() < 0.5 ? redTeamPlayers : blueTeamPlayers;
    const losingPlayers =
      redTeamPlayers === winningPlayers ? blueTeamPlayers : redTeamPlayers;

    // format players
    const winningTeam = winningPlayers.map(({ id, ...keys }) => {
      return { ...keys };
    });
    const losingTeam = losingPlayers.map(({ id, ...keys }) => {
      return { ...keys };
    });

    // mimic body from Riot Games tourny api
    const body = {
      startTime: 1234567890000,
      shortCode: tournamentCode, // this needs to reference an actual tourny code in the db
      metaData: `{"riotAuth":"1481d169-c40d-4770-bec8-97e8a4031278"}`,
      gameId: "4304210544",
      gameName: "a123bc45-ab1c-1a23-ab12-12345a67b89c",
      gameType: "Practice",
      gameMap: 11,
      gameMode: "CLASSIC",
      region: "NA1",
      winningTeam,
      losingTeam,
    };

    // mimic callback from Riot Games
    const res = await fetch("http://localhost:3000/api/match-rounds/", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(`POST'd match ${i + 1}/${seasonMatchRounds.length}`);

    console.log("res:", res.status);

    if (res.status === 404) {
      console.error("error", res);
    }
  }
};

module.exports = { simulateGroupStageMatches };
