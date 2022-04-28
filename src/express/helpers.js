const https = require("https");
const { default: fetch } = require("node-fetch");
const provider = require("../sequelize/models/provider");

// A helper function to assert the request ID param is valid
// and convert it to a number (since it comes as a string by default)
function getIdParam(req) {
  const id = req.params.id;
  if (/^\d+$/.test(id)) {
    return Number.parseInt(id, 10);
  }
  throw new TypeError(`Invalid ':id' param: "${id}"`);
}

// TODO: install node-fetch lmao and rewrite this
async function createProviderId2() {
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
        "Content-Type": "application/json",
        "X-Riot-Token": process.env.RIOT_GAMES_API_KEY,
      },
    }
  );

  const providerId = await res.json();
  console.log("provider id!", providerId);
  console.log("provider id typeof", typeof providerId);
  if (
    (typeof providerId === "object" &&
      providerId.hasOwnProperty("status") &&
      providerId.status.status_code < 200) ||
    providerId.status.status_code >= 300
  ) {
    throw new Error(providerId.status.status_code);
  }

  return providerId;
}

// TODO: After that, ensure this thing BREAKS properly and WORKS properly

// TODO: After that, make sure any existing providerIds are DELETED before making a new one

// TODO: After that, make a new TOURNAMENT with the new providerId and store that on a Season record

// TODO: Make sure you can create tournament codes when making a new match and attach it to the proper Season
const createProviderId = () => {
  return new Promise((resolve, reject) => {
    const ProviderRegistrationParameters = JSON.stringify({
      region: "NA",
      url: process.env.BTL_MATCHES_ENDPOINT,
    });

    const options = {
      hostname: "americas.api.riotgames.com",
      path: "/lol/tournament-stub/v4/providers",
      method: "POST",
      port: 443,
      headers: {
        "Content-Type": "application/json",
        "X-Riot-Token": process.env.RIOT_GAMES_API_KEY,
      },
    };

    const req = https
      .request(options, (res) => {
        let body = [];

        res.on("data", (chunk) => {
          body.push(chunk);
        });

        return res.on("end", () => {
          resolve("Made it to the end!");
          // return JSON.parse(Buffer.concat(body).toString());
        });
      })
      .on("error", (error) => {
        console.log(error);
        reject(error);
      });

    req.write(ProviderRegistrationParameters);
    req.end();
  });
};

async function createTournament(providerId) {
  // Docs on creating a tournament with a providerId
  // https://developer.riotgames.com/apis#tournament-stub-v4/POST_registerTournament
  const TournamentRegistrationParameters = {
    name: "Test tournament! :3",
    providerId: providerId,
  };

  const options = {
    hostname: "americas.api.riotgames.com",
    path: "/lol/tournament-stub/v4/tournaments",
    method: "POST",
    headers: {
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
          throw new Error(e);
        }
        return body;
      });
    })
    .on("error", (error) => {
      console.error("ERROR:", error);
      throw new Error("Failed to generate tournament codes.");
    });

  req.write(TournamentRegistrationParameters);
  req.end();
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
  createProviderId2,
  createTournament,
};
