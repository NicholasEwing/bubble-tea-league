const { prisma } = require("../prisma/db");

async function createProviderId() {
  // Docs on creating a new providerId
  // New API key means you need to re-register as a provider
  // https://developer.riotgames.com/apis#tournament-stub-v4/POST_registerProviderData

  const ProviderRegistrationParameters = {
    region: "NA",
    url: process.env.BTL_MATCHES_ENDPOINT,
  };

  const res = await fetch(
    "https://americas.api.riotgames.com/lol/tournament-stub/v4/providers",
    {
      method: "POST",
      body: JSON.stringify(ProviderRegistrationParameters),
      headers: {
        "X-Riot-Token": process.env.RIOT_GAMES_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  const providerId = await res.json();
  const hasStatusCode = !!providerId?.status?.status_code;

  let statusCode;
  if (hasStatusCode) {
    statusCode = providerId?.status?.status_code;
  }

  if (hasStatusCode && (statusCode < 200 || statusCode >= 300)) {
    throw new Error(
      `Error from Riot Games API. Received status code ${statusCode}. Error message: ${providerId.status.message}`
    );
  }

  return providerId;
}

async function createTournamentId(providerId, name) {
  // Docs on creating a tournament with a providerId
  // https://developer.riotgames.com/apis#tournament-stub-v4/POST_registerTournament
  const TournamentRegistrationParameters = {
    name,
    providerId,
  };

  const res = await fetch(
    "https://americas.api.riotgames.com/lol/tournament-stub/v4/tournaments",
    {
      method: "POST",
      body: JSON.stringify(TournamentRegistrationParameters),
      headers: {
        "X-Riot-Token": process.env.RIOT_GAMES_API_KEY,
      },
    }
  );

  const tournamentId = await res.json();
  const hasStatusCode = !!tournamentId?.status?.status_code;

  let statusCode;
  if (hasStatusCode) {
    statusCode = tournamentId.status.status_code;
  }

  if (hasStatusCode && (statusCode < 200 || statusCode >= 300)) {
    throw new Error(
      `Error from Riot Games API. Received status code ${statusCode}. Error message: ${tournamentId.status.message}`
    );
  }
  return tournamentId;
}

async function getPlayerPUUID(summonerName) {
  const res = await fetch(
    `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`,
    {
      headers: {
        "X-Riot-Token": process.env.RIOT_GAMES_API_KEY,
      },
    }
  );
  const playerInfo = await res.json();
  const { puuid } = playerInfo;

  if (process.env.NODE_ENV !== "production")
    console.log(`Got PUUID for ${summonerName}: ${puuid}`);

  const hasStatusCode = !!playerInfo?.status?.status_code;

  let statusCode;
  if (hasStatusCode) {
    statusCode = playerInfo.status.status_code;
  }

  if (hasStatusCode && (statusCode < 200 || statusCode >= 300)) {
    throw new Error(
      `Error from Riot Games API. Received status code ${statusCode}. Error message: ${playerInfo.status.message}`
    );
  }
  return puuid;
}

async function generateTournamentCodes(tournamentId, count) {
  // Docs on creating tournament codes:
  // https://developer.riotgames.com/apis#tournament-stub-v4/POST_createTournamentCode

  const TournamentCodeParameters = {
    mapType: "SUMMONERS_RIFT",
    metadata: "", // metadata only accepts strings
    pickType: "TOURNAMENT_DRAFT",
    spectatorType: "LOBBYONLY",
    teamSize: 5,
  };

  const res = await fetch(
    `https://americas.api.riotgames.com/lol/tournament-stub/v4/codes?count=${count}&tournamentId=${tournamentId}`,
    {
      method: "POST",
      body: JSON.stringify(TournamentCodeParameters),
      headers: {
        "X-Riot-Token": process.env.RIOT_GAMES_API_KEY,
      },
    }
  );

  const tournamentCodes = await res.json();
  const hasStatusCode = !!tournamentCodes?.status?.status_code;

  let statusCode;
  if (hasStatusCode) {
    statusCode = tournamentCodes.status.status_code;
  }

  if (hasStatusCode && (statusCode < 200 || statusCode >= 300)) {
    throw new Error(
      `Error from Riot Games API. Received status code ${statusCode}. Error message: ${tournamentCodes.status.message}`
    );
  }
  return tournamentCodes;
}

async function findTeamIdsFromMatchResults(
  matchResults,
  seasonId,
  winningPlayers,
  losingPlayers
) {
  const { winningTeam, losingTeam } = matchResults;

  const winningNames = winningTeam.map((p) => p.summonerName);
  const losingNames = losingTeam.map((p) => p.summonerName);

  const winningPlayerIds = winningPlayers.map((wp) => wp.id);
  const losingPlayerIds = losingPlayers.map((wp) => wp.id);

  // find their team ids for this season...
  const seasonTeams = await prisma.team.findMany({
    where: {
      seasonId,
    },
    select: {
      id: true,
    },
  });
  const seasonTeamIds = seasonTeams.map((st) => st.id);

  // TODO: find a way to ensure team ids are found properly for the player AND season...
  const { teamId: winningTeamId } =
    await prisma.playerTeamHistory.findFirstOrThrow({
      where: {
        playerId: {
          in: winningPlayerIds,
        },
        teamId: {
          in: seasonTeamIds,
        },
      },
      select: {
        teamId: true,
      },
    });

  const { teamId: losingTeamId } =
    await prisma.playerTeamHistory.findFirstOrThrow({
      where: {
        playerId: {
          in: losingPlayerIds,
        },
        teamId: {
          in: seasonTeamIds,
        },
      },
      select: {
        teamId: true,
      },
    });

  return { winningTeamId, losingTeamId };
}

async function v5getMatch(gameId) {
  const riotGameId = `NA1_${gameId}`;
  const riotGamesResponse = await fetch(
    `https://americas.api.riotgames.com/lol/match/v5/matches/${riotGameId}`,
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
      `Error from Riot Games API. Received status code ${statusCode}. Error message: ${matchRoundResults.status.message}`
    );
  }

  return matchRoundResults;
}

async function getTimelineEvents(gameId) {
  const riotGameId = `NA1_${gameId}`;
  const riotGamesResponse = await fetch(
    `https://americas.api.riotgames.com/lol/match/v5/matches/${riotGameId}/timeline`,
    {
      headers: {
        "X-Riot-Token": process.env.RIOT_GAMES_API_KEY,
      },
    }
  );

  const timelineEvents = await riotGamesResponse.json();
  const hasStatusCode = !!timelineEvents?.status?.status_code;

  let statusCode;
  if (hasStatusCode) {
    statusCode = timelineEvents?.status?.status_code;
  }

  if (hasStatusCode && (statusCode < 200 || statusCode >= 300)) {
    throw new Error(
      `Error from Riot Games API. Received status code ${statusCode}. Error message: ${timelineEvents.status.message}`
    );
  }

  return timelineEvents;
}

module.exports = {
  createProviderId,
  createTournamentId,
  getPlayerPUUID,
  generateTournamentCodes,
  findTeamIdsFromMatchResults,
  v5getMatch,
  getTimelineEvents,
};
