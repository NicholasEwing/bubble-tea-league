const sequelize = require("../../../sequelize");
const { Team } = sequelize.models;
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
      case "GET":
        const teams = await Team.findAll();
        res.status(200).json(teams);
        break;
      case "POST":
        const team = await Team.create(req.body);
        res.status(201).end();
        break;
      case "UPDATE":
        await Team.create(req.body);
        res.status(201).end();
        break;
      case "PATCH":
        try {
          const { teams } = req.body;
          await Team.bulkCreate(teams, {
            updateOnDuplicate: ["teamName", "tricode"],
          });
          res.status(200).send();
        } catch (error) {
          res.status(500).send({ error });
        }
        break;
    }
  } catch (error) {
    console.error("Error inside /api/teams", error);
  }
}
