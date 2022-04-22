const sequelize = require("../sequelize");

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
        discordName: "Nicholas Ewing",
        TeamId: 4,
      },
      { summonerName: "Chase Hunt", discordName: "Chase Hunt", TeamId: 4 },
      {
        summonerName: "Chris Concannon",
        discordName: "Chris Concannon",
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
