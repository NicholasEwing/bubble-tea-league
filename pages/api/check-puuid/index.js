// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const sequelize = require("../../../sequelize");
import { getPlayerPUUID } from "../../../lib/riot-games-api-helpers";

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "POST":
        try {
          const { summonerName } = req.body;
          const PUUID = await getPlayerPUUID(summonerName);
          res.status(200).send({ PUUID });
        } catch (error) {
          res.status(404).send(false);
        }
        break;
    }
  } catch (error) {
    console.error("Error inside /api/check-puuid", error);
  }
}
