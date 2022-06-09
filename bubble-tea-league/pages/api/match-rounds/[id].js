import { getIdParam } from "../../../lib/general-api-helpers";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const sequelize = require("../../../sequelize");
const { MatchRound } = sequelize.models;

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      const matchRoundId = getIdParam(req);
      const matchRound = await MatchRound.findByPk(matchRoundId);
      res.status(200).json(matchRound);
      break;
  }
}
