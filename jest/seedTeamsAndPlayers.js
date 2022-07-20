const sequelize = require("../sequelize/index");
const { RateLimiter } = require("limiter");
const { getPlayerPUUID } = require("../lib/riot-games-api-helpers");
const player = require("../sequelize/models/player");
const { Player } = sequelize.models;

const seedTeamsAndPlayers = async () => {
  try {
    // generate 10 teams, but only 10 players

    // The player objects must use REAL summoner names
    // so we can get their unique PUUIDs via the Riot Games API
    const { btlTeams, btlPlayers } = require("../lib/hardcoded-btl-teams");
    await sequelize.models.Team.bulkCreate(btlTeams);

    // only create teams 2 and 4 for testing purposes so we don't piss off Riot
    const limiter = new RateLimiter({
      tokensPerInterval: 20,
      interval: "second",
    });

    const teamTwoAndFourPlayers = btlPlayers.filter((player) => {
      return player.TeamId === 4 || player.TeamId === 2;
    });

    // check if players exist
    const players = await Player.findAll({ raw: true });

    if (!players.length) {
      // Add PUUID to each player before adding to db
      for (const player of teamTwoAndFourPlayers) {
        try {
          const remainingRequests = await limiter.removeTokens(1);
          const foundPUUID = await getPlayerPUUID(player.summonerName);
          player.PUUID = foundPUUID;
          console.log(
            `Set PUUID of ${foundPUUID} for ${player.summonerName} on Team ${player.TeamId}`
          );
        } catch (error) {
          console.error("Received an error when retrieving PUUIDs");
          console.error(error.message);
          break;
        }
      }

      await sequelize.models.Player.bulkCreate(teamTwoAndFourPlayers);
    }

    // Add players to db
    return true;
  } catch (error) {
    throw new Error(
      "Failed to seed placeholder teams and players for testing purposes."
    );
  }
};

module.exports = seedTeamsAndPlayers;
