import { getIdParam } from "../../../lib/general-api-helpers";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const sequelize = require("../../../sequelize");
const { Match } = sequelize.models;

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      const matchId = getIdParam(req);
      const match = await Match.findByPk(matchId);
      res.status(200).json(match);
      break;
    case "PATCH":
      const patchId = getIdParam(req);
      // We only accept an UPDATE request if the `:id` param matches the body `id`
      if (req.body.id === patchId) {
        await Match.update(req.body, {
          where: {
            id: patchId,
          },
        });
        res.status(200).end();
      } else {
        res
          .status(400)
          .send(
            `Bad request: param ID (${id}) does not match body ID (${req.body.id}).`
          );
      }
      break;
    case "DELETE":
      const deleteId = getIdParam(req);
      await Match.destroy({
        where: {
          id: deleteId,
        },
      });
      res.status(200).end();
      break;
  }
}
