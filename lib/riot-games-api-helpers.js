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

async function generateTournamentCodes(bestOf, tournamentId, matches = 1) {
  // Docs on creating tournament codes:
  // https://developer.riotgames.com/apis#tournament-stub-v4/POST_createTournamentCode

  const TournamentCodeParameters = {
    mapType: "SUMMONERS_RIFT",
    metadata: "", // metadata only accepts strings
    pickType: "TOURNAMENT_DRAFT",
    spectatorType: "LOBBYONLY",
    teamSize: 5,
  };

  const codesToMake = bestOf * matches;
  console.log(`making ${codesToMake} codes...`);

  const res = await fetch(
    `https://americas.api.riotgames.com/lol/tournament-stub/v4/codes?count=${codesToMake}&tournamentId=${tournamentId}`,
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

// async function findTeamIdsFromMatchResults(matchResults, season) {
//   const { winningTeam, losingTeam } = matchResults;

//   const winningNames = winningTeam.map((p) => p.summonerName);
//   const losingNames = losingTeam.map((p) => p.summonerName);

//   const winningPlayers = await Player.findAll({
//     attributes: ["id"],
//     where: {
//       summonerName: {
//         [Op.in]: winningNames,
//       },
//     },
//     raw: true,
//   });

//   const losingPlayers = await Player.findAll({
//     attributes: ["id"],
//     where: {
//       summonerName: {
//         [Op.in]: losingNames,
//       },
//     },
//     raw: true,
//   });

//   const winningPlayerIds = winningPlayers.map((wp) => wp.id);
//   const losingPlayerIds = losingPlayers.map((wp) => wp.id);

//   // find their team ids for this season...
//   const seasonTeams = await Team.findAll({
//     where: {
//       season,
//     },
//     attributes: ["id"],
//     raw: true,
//   });

//   const seasonTeamIds = seasonTeams.map((st) => st.id);

//   // TODO: find a way to ensure team ids are found properly for the player AND season...
//   const { teamId: winningTeamId } = await PlayerTeamHistory.findOne({
//     where: {
//       PlayerId: {
//         [Op.in]: winningPlayerIds,
//       },
//       teamId: {
//         [Op.in]: seasonTeamIds,
//       },
//     },
//     attributes: ["teamId"],
//     raw: true,
//   });

//   const { teamId: losingTeamId } = await PlayerTeamHistory.findOne({
//     where: {
//       PlayerId: {
//         [Op.in]: losingPlayerIds,
//       },
//       teamId: {
//         [Op.in]: seasonTeamIds,
//       },
//     },
//     attributes: ["teamId"],
//     raw: true,
//   });

//   return { winningTeamId, losingTeamId };
// }

// async function v5getMatch(gameId) {
//   const riotGameId = `NA1_${gameId}`;
//   const riotGamesResponse = await fetch(
//     `https://americas.api.riotgames.com/lol/match/v5/matches/${riotGameId}`,
//     {
//       headers: {
//         "X-Riot-Token": process.env.RIOT_GAMES_API_KEY,
//       },
//     }
//   );

//   const matchRoundResults = await riotGamesResponse.json();
//   const hasStatusCode = !!matchRoundResults?.status?.status_code;

//   let statusCode;
//   if (hasStatusCode) {
//     statusCode = matchRoundResults?.status?.status_code;
//   }

//   if (hasStatusCode && (statusCode < 200 || statusCode >= 300)) {
//     throw new Error(
//       `Error from Riot Games API. Received status code ${statusCode}. Error message: ${matchRoundResults.status.message}`
//     );
//   }

//   return matchRoundResults;
// }

// async function getTimelineEvents(gameId) {
//   const riotGameId = `NA1_${gameId}`;
//   const riotGamesResponse = await fetch(
//     `https://americas.api.riotgames.com/lol/match/v5/matches/${riotGameId}/timeline`,
//     {
//       headers: {
//         "X-Riot-Token": process.env.RIOT_GAMES_API_KEY,
//       },
//     }
//   );

//   const timelineEvents = await riotGamesResponse.json();
//   const hasStatusCode = !!timelineEvents?.status?.status_code;

//   let statusCode;
//   if (hasStatusCode) {
//     statusCode = timelineEvents?.status?.status_code;
//   }

//   if (hasStatusCode && (statusCode < 200 || statusCode >= 300)) {
//     throw new Error(
//       `Error from Riot Games API. Received status code ${statusCode}. Error message: ${timelineEvents.status.message}`
//     );
//   }

//   return timelineEvents;
// }

module.exports = {
  createProviderId,
  createTournamentId,
  getPlayerPUUID,
  generateTournamentCodes,
  // findTeamIdsFromMatchResults,
  // v5getMatch,
  // getTimelineEvents,
};
