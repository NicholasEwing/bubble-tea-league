// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const sequelize = require("../../../sequelize");
const { PlayerTeamHistory } = sequelize.models;

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "PATCH":
        try {
          const { playerTeamHistory } = req.body;
          await PlayerTeamHistory.bulkCreate(playerTeamHistory, {
            updateOnDuplicate: ["TeamId", "role"],
          });
          res.status(200).send();
        } catch (error) {
          res.status(500).send({ error });
        }
        break;
      case "DELETE":
        try {
          const { idsToDelete } = req.body;
          await PlayerTeamHistory.destroy({
            where: { id: idsToDelete },
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