import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../prisma/db";

export default async function handler(req, res) {
  try {
    if (process.env.NODE_ENV === "production") {
      const session = await unstable_getServerSession(req, res, authOptions);
      const userIsAdmin = admins.includes(session?.user?.email);
      if (!userIsAdmin) res.status(401).end();
    }

    switch (req.method) {
      case "GET":
        const teams = await prisma.team.findMany();
        res.status(200).json(teams);
        break;
      case "POST":
        // TODO: ADD team info
        console.log(req.body);
        // const team = await prisma.create({ data: {

        // } });
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
