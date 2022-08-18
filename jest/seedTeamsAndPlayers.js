const sequelize = require("../sequelize/index");
const { RateLimiter } = require("limiter");
const { getPlayerPUUID } = require("../lib/riot-games-api-helpers");
const { Player, Team, PlayerTeamHistory } = sequelize.models;

const seedTeamsAndPlayers = async () => {
  try {
    // The player objects must use REAL summoner names
    // so we can get their unique PUUIDs via the Riot Games API
    const { btlTeams, btlPlayers } = require("../lib/hardcoded-btl-teams");

    const limiter = new RateLimiter({
      tokensPerInterval: 20,
      interval: "second",
    });

    // check if players exist
    const players = await Player.findAll({ raw: true });

    let playerRecords;
    if (!players.length) {
      // Add PUUID to each player before adding to db
      for (const player of btlPlayers) {
        try {
          const remainingRequests = await limiter.removeTokens(1);
          const foundPUUID = await getPlayerPUUID(player.summonerName);
          player.PUUID = foundPUUID;
          console.log(`Set PUUID of ${foundPUUID} for ${player.summonerName}`);
        } catch (error) {
          console.error("Received an error when retrieving PUUIDs");
          console.error(error.message);
          break;
        }
      }

      playerRecords = await Player.bulkCreate(btlPlayers);
    }

    const teams = await Team.findAll({ raw: true });

    const teamIds = teams.map((t) => t.id);

    const playerIds = playerRecords.map((pr) => pr.id);

    let j = 0;
    const playerTeamHistoryRecords = playerIds.map((playerId, i) => {
      if (i > 0 && i % 5 === 0) {
        j++;
      }

      let teamNumber = teamIds[j];

      return { TeamId: teamNumber, PlayerId: playerId };
    });

    await PlayerTeamHistory.bulkCreate(playerTeamHistoryRecords);

    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = seedTeamsAndPlayers;
