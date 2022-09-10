const { RateLimiter } = require("limiter");
const gameIds = require("../lib/gameIds");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const simulateGroupStageMatches = async (seasonIdStr) => {
  const seasonId = parseInt(seasonIdStr);

  const seasonMatchIds = (
    await prisma.match.findMany({
      where: {
        seasonId,
        isPlayoffsMatch: false,
      },
      select: {
        id: true,
      },
    })
  ).map((o) => o.id);

  const seasonMatchRounds = await prisma.matchRound.findMany({
    where: {
      tournamentCode: {
        not: undefined,
      },
      matchId: {
        in: seasonMatchIds,
      },
    },
    select: {
      tournamentCode: true,
      redTeamId: true,
      blueTeamId: true,
    },
  });

  const seasonTeamIds = (
    await prisma.team.findMany({
      where: {
        seasonId,
      },
      select: {
        id: true,
      },
    })
  ).map((o) => o.id);

  const seasonHistories = await prisma.playerTeamHistory.findMany({
    where: {
      teamId: {
        in: seasonTeamIds,
      },
    },
  });

  const allPlayers = await prisma.player.findMany({
    select: {
      id: true,
      summonerName: true,
    },
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
      (h) => h.teamId === redTeamId
    );
    const blueTeamHistory = seasonHistories.filter(
      (h) => h.teamId === blueTeamId
    );

    // find player ids
    const redTeamPlayerIds = redTeamHistory.map((p) => p.playerId);
    const blueTeamPlayerIds = blueTeamHistory.map((p) => p.playerId);

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
      // metaData: `{"riotAuth": "${process.env.BTL_API_KEY}"}`,
      gameId: `${gameIds[i] || 4304210544}`,
      gameName: "a123bc45-ab1c-1a23-ab12-12345a67b89c",
      gameType: "Practice",
      gameMap: 11,
      gameMode: "CLASSIC",
      region: "NA1",
      winningTeam,
      losingTeam,
    };

    // mimic callback from Riot Games
    const res = await fetch("http://localhost:3000/api/match-rounds", {
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
