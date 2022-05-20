// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const sequelize = require("../../../sequelize");
const { Team } = sequelize.models;

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      await Team.create(req.body);
      res.status(201).end();
      break;
    case "GET":
      const teams = await Team.findAll();
      res.status(200).json(teams);
      break;
    case "UPDATE":
      await Team.create(req.body);
      res.status(201).end();
      break;
  }
}
