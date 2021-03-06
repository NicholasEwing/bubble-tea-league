import { getIdParam } from "../../../lib/general-api-helpers";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const sequelize = require("../../../sequelize");
const { Team } = sequelize.models;

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      const teamId = getIdParam(req);
      const team = await Team.findByPk(teamId);
      res.status(200).json(team);
      break;
    case "PATCH":
      const patchId = getIdParam(req);
      // We only accept an UPDATE request if the `:id` param matches the body `id`
      if (req.body.id === patchId) {
        await Team.update(req.body, {
          where: {
            id: patchId,
          },
        });
        res.status(200).end();
      } else {
        res
          .status(400)
          .send(
            `Bad request: param ID (${patchId}) does not match body ID (${req.body.id}).`
          );
      }
      break;
    case "DELETE":
      const deleteId = getIdParam(req);
      await Team.destroy({
        where: {
          id: deleteId,
        },
      });
      res.status(200).end();
      break;
  }
}
