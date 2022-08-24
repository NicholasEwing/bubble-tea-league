import { getIdParam } from "../../../lib/general-api-helpers";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import admins from "../../../sequelize/admins";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const sequelize = require("../../../sequelize");
const { MatchRound } = sequelize.models;

export default async function handler(req, res) {
  if (process.env.NODE_ENV === "production") {
    const session = await unstable_getServerSession(req, res, authOptions);
    const userIsAdmin = admins.includes(session?.user?.email);
    if (!userIsAdmin) res.status(401).end();
  }

  switch (req.method) {
    case "GET":
      const matchRoundId = getIdParam(req);
      const matchRound = await MatchRound.findByPk(matchRoundId);
      res.status(200).json(matchRound);
      break;
  }
}
