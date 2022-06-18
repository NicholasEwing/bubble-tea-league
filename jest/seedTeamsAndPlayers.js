const sequelize = require("../sequelize/index");
const { RateLimiter } = require("limiter");
const { getPlayerPUUID } = require("../lib/riot-games-api-helpers");

const seedTeamsAndPlayers = async () => {
  // generate 10 teams, but only 10 players

  // The player objects must use REAL summoner names
  // so we can get their unique PUUIDs via the Riot Games API
  const { btlTeams, btlPlayers } = require("../lib/hardcoded-btl-teams");
  await sequelize.models.Team.bulkCreate(btlTeams);

  // only create teams 2 and 4 for testing purposes so we don't piss off Riot
  const limiter = new RateLimiter({
    tokensPerInterval: 30,
    interval: "second",
  });

  const teamTwoAndFourPlayers = btlPlayers.filter((player) => {
    return player.TeamId === 4 || player.TeamId === 2;
  });

  // Add PUUID to each player before adding to db
  for (const player of teamTwoAndFourPlayers) {
    const remainingRequests = await limiter.removeTokens(1);
    const foundPUUID = await getPlayerPUUID(player.summonerName);
    player.PUUID = foundPUUID;
    console.log(
      `Set PUUID of ${foundPUUID} for ${player.summonerName} on Team ${player.TeamId}`
    );
  }

  // Add players to db
  await sequelize.models.Player.bulkCreate(teamTwoAndFourPlayers);
  return true;
};

module.exports = seedTeamsAndPlayers;
