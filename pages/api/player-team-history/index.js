// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { prisma } = require("../../../prisma/db");

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "PATCH":
        try {
          const { playerTeamHistories } = req.body;
          for (const history of playerTeamHistories) {
            const { id, teamId, role } = history;

            await prisma.playerTeamHistory.update({
              where: {
                id,
              },
              data: {
                teamId: parseInt(teamId),
                role,
              },
            });
          }
          res.status(200).send();
        } catch (error) {
          console.log("error", error);
          res.status(500).send({ error });
        }
        break;
      case "DELETE":
        try {
          const { idsToDelete } = req.body;
          await prisma.playerTeamHistory.deleteMany({
            where: {
              id: {
                in: idsToDelete,
              },
            },
          });
          res.status(200).send();
        } catch (error) {
          res.status(404).send({ error });
        }
        break;
    }
  } catch (error) {
    console.error("Error inside /api/player-team-history", error);
  }
}
