const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { btlPlayers } = require("../lib/hardcoded-btl-teams");
const { getPlayerPUUID } = require("../lib/riot-games-api-helpers");

async function main() {
  await prisma.match.deleteMany();
  await prisma.matchRound.deleteMany();
  await prisma.matchRoundPlayerStats.deleteMany();
  await prisma.matchRoundTeamStats.deleteMany();
  await prisma.player.deleteMany();
  await prisma.playerTeamHistory.deleteMany();
  await prisma.season.deleteMany();
  await prisma.teamStanding.deleteMany();
  await prisma.team.deleteMany();
  await prisma.provider.deleteMany();

  // todo: probably rate limit this in the future...
  for (const player of btlPlayers) {
    const PUUID = await getPlayerPUUID(player.summonerName);
    player.PUUID = PUUID;
  }

  await prisma.player.createMany({
    data: btlPlayers,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
