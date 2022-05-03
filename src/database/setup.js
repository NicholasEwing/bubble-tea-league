const sequelize = require("../sequelize");
const { fakeTeams, fakePlayers } = require("./fake-info-generator");

// console.log("fake teams:", fakeTeams);
// console.log("fake players", fakePlayers);

const reset = async () => {
  console.log("Rewriting the MySQL database and adding dummy data.");

  try {
    await sequelize.sync({ force: true });

    const { Team, Player, Match } = sequelize.models;

    // Create teams
    await Team.bulkCreate([
      { teamName: "The Good Bois" },
      { teamName: "Acid Rabbits" },
      { teamName: "Second Breakfast" },
      { teamName: "Deep Dive" },
      { teamName: "True Heart Destiny" },
    ]);

    // Create players

    await Player.bulkCreate([
      {
        summonerName: "Nicholas Ewing",
        discordName: "Nicholas#1234",
        TeamId: 4,
      },
      { summonerName: "Chase Hunt", discordName: "Chase Hunt", TeamId: 4 },
      {
        summonerName: "Chris Concannon",
        discordName: "Chris#1234",
        TeamId: 4,
      },
      {
        summonerName: "Charlie Perez",
        discordName: "Charlie Perez",
        TeamId: 4,
      },
      {
        summonerName: "Testy McTesterson",
        discordName: "Testy McTesterson",
        TeamId: 4,
      },
    ]);

    return "Reset finished";
  } catch (error) {
    console.log(error);
  }
};

module.exports = { reset };
