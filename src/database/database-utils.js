const sequelize = require("../sequelize");
const { RateLimiter } = require("limiter");
const { default: fetch } = require("node-fetch");
const {
  Team,
  Player,
  Provider,
  Season,
  Match,
  MatchRound,
  TeamMatchRounds,
  MatchRoundPlayerStats,
  MatchRoundTeamStats,
} = sequelize.models;
const {
  createProviderId,
  createTournamentId,
  generateTournamentCodes,
  getPlayerPUUID,
} = require("../express/helpers");

// This file just contains some functions to easily reset my database
// and fill it with new or fake data to test the app's functionality.

// This makes it easy to set up new providers / tournaments as my
// development API key expires or as I need to change the structure
// of my database.

const resetDatabase = async () => {
  await MatchRoundPlayerStats.drop();
  await MatchRoundTeamStats.drop();
  await MatchRound.drop();
  await Match.drop();
  await Player.drop();
  await Team.drop();
  await sequelize.drop();
  await sequelize.sync({ force: true });
  return true;
};

// create a new Provider ID via Riot Games API
const createProviderInDb = async () => {
  const providerId = await createProviderId();
  await Provider.create({ providerId });
  return providerId;
};

// create a new Tournament ID for our Season via Riot Games API
const createSeasonInDb = async (providerId, season) => {
  const tournamentId = await createTournamentId(providerId);
  await Season.create({ number: season, tournamentId });
  return tournamentId;
};

// create multiple teams in our database
const createTeamsInDb = async (teams, season) => {
  teams.forEach((team) => (team.season = season));
  await Team.bulkCreate(teams);
};

// create multiple players in our database
const createPlayersInDb = async (players) => {
  // The player objects must use REAL summoner names
  // so we can get their unique PUUIDs via the Riot Games API

  // Add PUUID to each player before adding to db
  for (const player of players) {
    // rate limit ourselves when looping
    const limiter = new RateLimiter({
      tokensPerInterval: 20,
      interval: "second",
    });

    const remainingRequests = await limiter.removeTokens(1);
    const foundPUUID = await getPlayerPUUID(player.summonerName);
    player.PUUID = foundPUUID;
    console.log(`Set PUUID of ${foundPUUID} for ${player.summonerName}`);
  }

  // Add players to db
  await Player.bulkCreate(players);
};

// create a match in our db with associated matchRounds
// and tournament codes via the Riot Games API
const createMatchInDb = async (tournamentId, season, bestOf) => {
  // create a match to get matchId
  const matchObj = {
    season,
  };
  const match = await Match.create(matchObj);
  const matchId = match.dataValues.id;

  // create X number of match rounds
  // and associate them with the new matchId
  const tournamentCodes = await generateTournamentCodes(
    season,
    bestOf,
    tournamentId,
    matchId
  );

  // For every code, make a match round and slap a tourny code on it
  tournamentCodes.forEach(async (tournamentCode) => {
    const matchRoundObj = {
      MatchId: matchId,
      tournamentCode,
    };

    await MatchRound.create(matchRoundObj);
  });

  return tournamentCodes;
};

const pickTwoRandomTeamIds = async () => {
  // Grab two team ids (1 - 10) to be our winning / losing team.

  const randomTeam = (numCantRepeat) => {
    const randomNum = Math.floor(Math.random() * 10) + 1;

    if (numCantRepeat) {
      while (randomNum === numCantRepeat) {
        randomNum = Math.floor(Math.random() * 10) + 1;
      }
    }

    return randomNum;
  };

  const winningTeamId = randomTeam();
  const losingTeamId = randomTeam(winningTeamId);
  if (winningTeamId === losingTeamId) {
    throw new Error("Winning and losing teams can't be the same!");
  }

  return { winningTeamId, losingTeamId };
};

// Used for saving randomized JSON data
// to a file for easier debugging
const saveJSONtoFile = (data, fileName) => {
  const obj = {
    table: [],
  };

  obj.table.push(data);

  const json = JSON.stringify(obj);
  const fs = require("fs");
  fs.writeFile(fileName, json, "utf8", () => {
    console.log(`Saved ${fileName} to local repo.`);
  });
};

// Before updating a match round, find the teamId for the winning and losing team
// since the Riot Games callback only provides winning / losing summoner names
const findTeamIdsFromMatchResults = async (matchResults) => {
  const firstWinner = matchResults.winningTeam[0].summonerName;
  const firstLoser = matchResults.losingTeam[0].summonerName;

  const winningPlayer = await Player.findOne({
    where: { summonerName: firstWinner },
  });
  const winningTeamId = winningPlayer.TeamId;

  const losingPlayer = await Player.findOne({
    where: { summonerName: firstLoser },
  });
  const losingTeamId = losingPlayer.TeamId;

  return { winningTeamId, losingTeamId };
};

const updateMatchResultsInDb = async (hardcodedTournamentCode) => {
  // First, we need a winning and losing team
  const { winningTeamId, losingTeamId } = await pickTwoRandomTeamIds();

  // Now we need to find the players on those teams to fill out
  // our matchResults object with some dummy data
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

  // Now let's fake a POST request from Riot Games with
  // two random teams and one of our tournament codes from earlier
  const matchResults = {
    startTime: 1234567890000,
    winningTeam: [
      {
        summonerName: winningPlayers[0].summonerName,
      },
      {
        summonerName: winningPlayers[1].summonerName,
      },
      {
        summonerName: winningPlayers[2].summonerName,
      },
      {
        summonerName: winningPlayers[3].summonerName,
      },
      {
        summonerName: winningPlayers[4].summonerName,
      },
    ],
    losingTeam: [
      {
        summonerName: losingPlayers[0].summonerName,
      },
      {
        summonerName: losingPlayers[1].summonerName,
      },
      {
        summonerName: losingPlayers[2].summonerName,
      },
      {
        summonerName: losingPlayers[3].summonerName,
      },
      {
        summonerName: losingPlayers[4].summonerName,
      },
    ],
    shortCode: hardcodedTournamentCode, // mock the first round in our match from earlier being finished
    metaData: '{"matchId":1}', // we can put some stuff in here later to make our lives easier
    gameId: 1234567890, // we use this to hit the match v5 API later to get more team / player specific info
    gameName: "a123bc45-ab1c-1a23-ab12-12345a67b89c",
    gameType: "Practice",
    gameMap: 11,
    gameMode: "CLASSIC",
    region: "NA1",
  };

  // for copy/pasting into postman to replicate tourny callback response
  saveJSONtoFile(matchResults, "fakeRiotResults.json");

  // Construct the match round object that goes in our database

  // we need to find the team ids for the winning / losing teams
  // we don't want to use winningTeamId / losingTeamId since
  // that's cheating and in a real-world example Riot wouldn't
  // give that to us directly since it don't know about our db
  const results = await findTeamIdsFromMatchResults(matchResults);

  const winningTeamIdResults = results.winningTeamId;
  const losingTeamIdResults = results.losingTeamId;

  const { metaData, gameId } = matchResults;
  const matchRoundObj = {
    gameId,
    winningTeamId: winningTeamIdResults,
    losingTeamId: losingTeamIdResults,
    metaData,
  };

  // Update the match round in our database and find it
  // using the tournament code Riot Games gave us in the callback
  const tournamentCode = matchResults.shortCode;
  await MatchRound.update(matchRoundObj, {
    where: {
      tournamentCode,
    },
  });

  // Now we need to hit the Riot Games match API AGAIN
  // to store relevant team / player info in MatchRoundTeamStats
  // and MatchRoundPlayerStats

  // TODO: Hit v5 match api using matchResults.gameId

  // Random ranked game I played
  const testGameId = `NA1_${4304210544}`;

  const res = await fetch(
    `https://americas.api.riotgames.com/lol/match/v5/matches/${testGameId}`,
    {
      headers: {
        "X-Riot-Token": process.env.RIOT_GAMES_API_KEY,
      },
    }
  );

  const testMatchRoundResults = await res.json();

  // TODO: Parse team info into a matchRoundTeamStatsObj
  // and store that in our database for each team
  const winningPUUIDs = winningPlayers.map((player) => player.PUUID);
  const losingPUUIDs = losingPlayers.map((player) => player.PUUID);
  const newParticipants = [...winningPUUIDs, ...losingPUUIDs];

  // Replace metadata player info
  const { participants } = testMatchRoundResults.metadata;
  participants.splice(0, participants.length, ...newParticipants); // manually replace participants

  // Replace individual player info
  const infoParticipants = testMatchRoundResults.info.participants; // this is an array of objects
  infoParticipants.forEach((player, i) => {
    player.puuid = newParticipants[i];
  });

  // save these results to a JSON file for debugging
  saveJSONtoFile(testMatchRoundResults, "matchRoundResults.json");
};

module.exports = {
  resetDatabase,
  createProviderInDb,
  createTeamsInDb,
  createSeasonInDb,
  createPlayersInDb,
  createMatchInDb,
  updateMatchResultsInDb,
};
