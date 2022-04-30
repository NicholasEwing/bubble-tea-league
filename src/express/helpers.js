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
  if (
    providerId?.status?.status_code &&
    (providerId.status.status_code < 200 ||
      providerId.status.status_code >= 300)
  ) {
    throw new Error(providerId.status.status_code);
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

async function generateTournamentCodes(bestOf, tournamentId) {
  // Docs on creating tournament codes:
  // https://developer.riotgames.com/apis#tournament-stub-v4/POST_createTournamentCode

  const metadata = JSON.stringify({
    title: "Team ABC vs. Team XYZ",
  });

  // the route we're hitting requires a "TournamentCodeParameters" object
  const TournamentCodeParameters = JSON.stringify({
    TournamentCodeParameters: {
      mapType: "SUMMONERS_RIFT",
      metadata: metadata, // metadata only accepts strings
      pickType: "TOURNAMENT_DRAFT",
      spectatorType: "LOBBYONLY",
      teamSize: 5,
    },
  });

  const options = {
    hostname: "americas.api.riotgames.com",
    path: `/lol/tournament-stub/v4/codes?count=${bestOf}&tournamentId=${tournamentId}`,
    method: "POST",
    header: {
      "Content-Type": "application/json",
      "X-Riot-Token": `${process.env.RIOT_GAMES_API_KEY}`,
    },
  };

  const req = https
    .request(options, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        throw new Error(`statuscode ${res.statusCode}`);
      }
      let body = [];

      res.on("data", (chunk) => {
        body.push(chunk);
      });

      res.on("end", () => {
        try {
          body = JSON.parse(Buffer.concat(body).toString());
        } catch (e) {
          reject(e);
        }
        return body;
      });
    })
    .on("error", (error) => {
      console.error("ERROR:", error);
      throw new Error("Failed to generate tournament codes.");
    });

  req.write(TournamentCodeParameters);
  req.end();
}

module.exports = {
  getIdParam,
  generateTournamentCodes,
  createProviderId,
  createTournament,
};
