const sequelize = require("../sequelize/index");
const { RateLimiter } = require("limiter");
const { getPlayerPUUID } = require("../lib/riot-games-api-helpers");

const seedTeamsAndPlayers = async () => {
  // generate 10 teams / players
  const { btlTeams, btlPlayers } = require("../lib/hardcoded-btl-teams");
  await sequelize.models.Team.bulkCreate(btlTeams);

  // The player objects must use REAL summoner names
  // so we can get their unique PUUIDs via the Riot Games API

  // Add PUUID to each player before adding to db
  for (const player of btlPlayers) {
    // rate limit ourselves when looping
    const limiter = new RateLimiter({
      tokensPerInterval: 30,
      interval: "second",
    });

    const remainingRequests = await limiter.removeTokens(1);
    const foundPUUID = await getPlayerPUUID(player.summonerName);
    player.PUUID = foundPUUID;
    console.log(`Set PUUID of ${foundPUUID} for ${player.summonerName}`);
  }

  // Add players to db
  await sequelize.models.Player.bulkCreate(btlPlayers);
  return true;
};

module.exports = seedTeamsAndPlayers;
