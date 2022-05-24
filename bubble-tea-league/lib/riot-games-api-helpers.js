const { default: fetch } = require("node-fetch");

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

async function createTournamentId(providerId) {
  // Docs on creating a tournament with a providerId
  // https://developer.riotgames.com/apis#tournament-stub-v4/POST_registerTournament
  const TournamentRegistrationParameters = {
    name: "Test tournament! :3",
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

module.exports = { createProviderId, createTournamentId, getPlayerPUUID };
