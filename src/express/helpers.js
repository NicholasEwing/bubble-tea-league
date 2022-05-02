const https = require("https");
const { default: fetch } = require("node-fetch");

// A helper function to assert the request ID param is valid
// and convert it to a number (since it comes as a string by default)
function getIdParam(req) {
  const id = req.params.id;
  if (/^\d+$/.test(id)) {
    return Number.parseInt(id, 10);
  }
  throw new TypeError(`Invalid ':id' param: "${id}"`);
}

async function createProviderId(riotGamesApiKey) {
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
        "X-Riot-Token": riotGamesApiKey,
      },
    }
  );

  const providerId = await res.json();
  const hasStatusCode = !!providerId?.status?.status_code;

  let statusCode;
  if (hasStatusCode) {
    statusCode = providerId.status.status_code;
  }

  if (hasStatusCode && (statusCode < 200 || statusCode >= 300)) {
    throw new Error(
      `Error from Riot Games API. Received status code ${statusCode}`
    );
  }

  return providerId;
}

async function createTournament(providerId) {
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

  // TODO: implement error handling

  // if (
  //   tournamentId?.status?.status_code &&
  //   (tournamentId.status.status_code < 200 ||
  //     tournamentId.status.status_code >= 300)
  // ) {
  //   throw new Error(tournamentId.status.status_code);
  // }

  return tournamentId;
}

async function generateTournamentCodes(season, bestOf, tournamentId) {
  // Docs on creating tournament codes:
  // https://developer.riotgames.com/apis#tournament-stub-v4/POST_createTournamentCode

  const metadata = JSON.stringify({
    title: `Season ${season} - Team ABC vs. Team XYZ`,
  });

  const TournamentCodeParameters = JSON.stringify({
    mapType: "SUMMONERS_RIFT",
    metadata, // metadata only accepts strings
    pickType: "TOURNAMENT_DRAFT",
    spectatorType: "LOBBYONLY",
    teamSize: 5,
  });

  // todo: pull tournament ID for season

  // todo: pull count from route options
  const res = await fetch(
    `https://americas.api.riotgames.com/lol/tournament-stub/v4/codes?count=${bestOf}tournamentId=${tournamentId}/`,
    {
      method: "POST",
      body: JSON.stringify(TournamentCodeParameters),
      headers: {
        "X-Riot-Token": process.env.RIOT_GAMES_API_KEY,
      },
    }
  );
}

module.exports = {
  getIdParam,
  generateTournamentCodes,
  createProviderId,
  createTournament,
};
