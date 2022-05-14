const sequelize = require("../sequelize");
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
  resetDatabase,
  createProviderInDb,
  createSeasonInDb,
  createTeamsInDb,
  createPlayersInDb,
  createMatchInDb,
  updateMatchResultsInDb,
} = require("./database-utils");

// We can't use fake teams / players anymore since match v5 results
// come back only using PUUIDs
// const { fakeTeams, fakePlayers } = require("./fake-info-generator");
const { btlTeams, btlPlayers } = require("./hardcoded-btl-teams");

const reset = async () => {
  console.log(
    "Rewriting the MySQL database and adding slightly randomized dummy data."
  );

  try {
    // hardcode season number for testing purposes
    const season = 8;

    // Reset database
    await resetDatabase();

    // Replicate POST to /providers/
    const providerId = await createProviderInDb();

    // Replicate POST to /seasons/
    const tournamentId = await createSeasonInDb(providerId, season);

    // Replicate multiple POSTS to /teams/
    await createTeamsInDb(btlTeams, season);

    // Replicate multiple POSTS to /players/
    await createPlayersInDb(btlPlayers, season);

    // Replicate POST to /matches/
    const bestOf = 3;
    const matchTournamentCodes = await createMatchInDb(
      tournamentId,
      season,
      bestOf
    );

    // Replicate POST from Riot Games API to /match-rounds/
    // with two random teams that we made earlier
    const hardcodedTournamentCode = matchTournamentCodes[0]; // we won't do this in a real world example since Rito will give it to us
    await updateMatchResultsInDb(hardcodedTournamentCode);

    console.log("Reset finished!");
    return true;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { reset };
