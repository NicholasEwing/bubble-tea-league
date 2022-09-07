const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
