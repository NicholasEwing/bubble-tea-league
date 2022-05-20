// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const sequelize = require("../../../sequelize");
const { Team } = sequelize.models;

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      const team = await Team.findByPk(req.body.id);
      res.status(200).json(team);
      break;
    case "UPDATE":
      // We only accept an UPDATE request if the `:id` param matches the body `id`
      if (req.body.id === id) {
        await Team.update(req.body, {
          where: {
            id: id,
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
      await Team.destroy({
        where: {
          id: req.body.id,
        },
      });
      res.status(200).end();
      break;
  }
}
