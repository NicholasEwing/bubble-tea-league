const { default: fetch } = require("node-fetch");
const sequelize = require("../sequelize");
const { Player } = sequelize.models;

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
      `Error from Riot Games API. Received status code ${statusCode}`
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
      `Error from Riot Games API. Received status code ${statusCode}`
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

  const hasStatusCode = !!playerInfo?.status?.status_code;

  let statusCode;
  if (hasStatusCode) {
    statusCode = playerInfo.status.status_code;
  }

  if (hasStatusCode && (statusCode < 200 || statusCode >= 300)) {
    throw new Error(
      `Error from Riot Games Summoner API. Received status code ${statusCode}`
    );
  }
  return puuid;
}

async function generateTournamentCodes(season, bestOf, tournamentId, MatchId) {
  // Docs on creating tournament codes:
  // https://developer.riotgames.com/apis#tournament-stub-v4/POST_createTournamentCode

  const metadata = JSON.stringify({
    MatchId,
  });

  const TournamentCodeParameters = {
    mapType: "SUMMONERS_RIFT",
    metadata, // metadata only accepts strings
    pickType: "TOURNAMENT_DRAFT",
    spectatorType: "LOBBYONLY",
    teamSize: 5,
  };

  // TODO: Figure out why tournamentId is not being passed correctly as query param
  const res = await fetch(
    `https://americas.api.riotgames.com/lol/tournament-stub/v4/codes?count=${bestOf}&tournamentId=${tournamentId}`,
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
      `Error from Riot Games API. Received status code ${statusCode}`
    );
  }
  return tournamentCodes;
}

async function findTeamIdsFromMatchResults(matchResults) {
  const firstWinner = matchResults.winningTeam[0].summonerName;
  const firstLoser = matchResults.losingTeam[0].summonerName;

  const winningPlayer = await Player.findOne({
    where: { summonerName: firstWinner },
    raw: true,
  });
  const winningTeamId = winningPlayer.TeamId;

  const losingPlayer = await Player.findOne({
    where: { summonerName: firstLoser },
    raw: true,
  });
  const losingTeamId = losingPlayer.TeamId;

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
      `Error from Riot Games API. Received status code ${statusCode}`
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
      `Error from Riot Games API. Received status code ${statusCode}`
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
