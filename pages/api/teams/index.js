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
      case "PATCH":
        try {
          const { teams } = req.body;
          for (const team of teams) {
            const { teamName, tricode, id } = team;

            await prisma.team.update({
              where: {
                id,
              },
              data: {
                teamName,
                tricode,
              },
            });
          }
          res.status(200).end();
        } catch (error) {
          res.status(500).send({ error });
        }
        break;
    }
  } catch (error) {
    console.error("Error inside /api/teams", error);
  }
}
