// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const sequelize = require("../../../sequelize");
import { getPlayerPUUID } from "../../../lib/riot-games-api-helpers";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import admins from "../../../sequelize/admins";

export default async function handler(req, res) {
  try {
    if (process.env.NODE_ENV === "production") {
      const session = await unstable_getServerSession(req, res, authOptions);
      const userIsAdmin = admins.includes(session?.user?.email);
      if (!userIsAdmin) res.status(401).end();
    }

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
