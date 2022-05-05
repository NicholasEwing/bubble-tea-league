const sequelize = require("../sequelize");
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
  createTournament,
  generateTournamentCodes,
} = require("../express/helpers");

const {
  fakeTeams,
  fakePlayers,
  fakeMatches,
} = require("./fake-info-generator");
const matchRound = require("../sequelize/models/matchRound");
const matchRoundTeamStats = require("../sequelize/models/matchRoundTeamStats");
const { table } = require("console");

const reset = async () => {
  console.log("Rewriting the MySQL database and adding dummy data.");

  try {
    // Reset database
    await MatchRoundPlayerStats.drop();
    await MatchRoundTeamStats.drop();
    await MatchRound.drop();
    await Match.drop();
    await Player.drop();
    await Team.drop();
    await sequelize.drop();
    await sequelize.sync({ force: true });

    // Create providers and season tournament
    const providerId = await createProviderId();
    await Provider.create({ providerId });

    const tournamentId = await createTournament(providerId);
    await Season.create({ number: 8, tournamentId });

    // Create fake teams
    await Team.bulkCreate(fakeTeams);

    // Create fake players
    await Player.bulkCreate(fakePlayers);

    // To create a match, we need to create match rounds
    // first depending on how many games are in the match

    // fake a req.body hitting /matches to generate tournament codes and match rounds
    const fakeBody = {
      season: 8,
      bestOf: 3,
    };

    const { season, bestOf } = fakeBody;

    // This is how we'd get the tourny ID, but we already have it
    // const { tournamentId } = await models.Season.findByPk(season, {
    //     raw: true,
    // });

    // create fake match to get matchId
    const matchObj = {
      season,
    };
    const fakeMatch = await Match.create(matchObj);
    const fakeMatchId = fakeMatch.dataValues.id;
    console.log("Created fake match:", fakeMatch.dataValues.id);

    // create X number of fake match rounds
    // and associate them with the new matchId
    const fakeTournamentCodes = await generateTournamentCodes(
      season,
      bestOf,
      tournamentId,
      fakeMatchId
    );

    // For every code, make a match round and slap a tourny code on it
    fakeTournamentCodes.forEach(async (tournamentCode) => {
      const matchRoundObj = {
        MatchId: fakeMatchId,
        tournamentCode,
      };

      const fakeMatchRound = await MatchRound.create(matchRoundObj);
    });

    // Now let's fake one of the rounds ending and update a match round

    // Make fake winning / losing teams
    const team1 = fakePlayers.filter((player) => player.TeamId === 1);
    const team4 = fakePlayers.filter((player) => player.TeamId === 4);

    // fake POST from Riot Games
    const matchResults = {
      startTime: 1234567890000,
      winningTeam: [
        {
          summonerName: team1[0].summonerName,
        },
        {
          summonerName: team1[1].summonerName,
        },
        {
          summonerName: team1[2].summonerName,
        },
        {
          summonerName: team1[3].summonerName,
        },
        {
          summonerName: team1[4].summonerName,
        },
      ],
      losingTeam: [
        {
          summonerName: team4[0].summonerName,
        },
        {
          summonerName: team4[1].summonerName,
        },
        {
          summonerName: team4[2].summonerName,
        },
        {
          summonerName: team4[3].summonerName,
        },
        {
          summonerName: team4[4].summonerName,
        },
      ],
      shortCode: "NA1234a-1a23b456-a1b2-1abc-ab12-1234567890ab",
      metaData: '{"matchId":1}',
      gameId: 1234567890,
      gameName: "a123bc45-ab1c-1a23-ab12-12345a67b89c",
      gameType: "Practice",
      gameMap: 11,
      gameMode: "CLASSIC",
      region: "NA1",
    };

    const obj = {
      table: [],
    };

    obj.table.push(matchResults);

    const json = JSON.stringify(obj);
    const fs = require("fs");
    fs.writeFile("fakeMatchResults.json", json, "utf8", () => {
      console.log("Done!");
    });

    // Before updating a match round, find the teamId for the winning and losing team:
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

    console.log("Winning team ID:", winningTeamId);
    console.log("Losing team ID:", losingTeamId);

    const { metaData, gameId } = matchResults;
    const matchRoundObj = {
      gameId,
      winningTeamId,
      losingTeamId,
      metaData,
    };

    // get matchId from metaData
    const resultMatchId = JSON.parse(metaData).matchId;

    // TODO: Update a match round record to include winning / losing team, gameId, and metaData
    await MatchRound.update(matchRoundObj, {
      where: {
        id: resultMatchId,
      },
    });

    return "Reset finished";
  } catch (error) {
    console.log(error);
  }
};

module.exports = { reset };
