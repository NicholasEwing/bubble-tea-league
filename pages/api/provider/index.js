import { createProviderId } from "../../../lib/riot-games-api-helpers";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import admins from "../../../sequelize/admins";
const sequelize = require("../../../sequelize");
const { Provider } = sequelize.models;

export default async function handler(req, res) {
  try {
    if (process.env.NODE_ENV === "production") {
      const session = await unstable_getServerSession(req, res, authOptions);
      const userIsAdmin = admins.includes(session?.user?.email);
      if (!userIsAdmin) res.status(401).end();
    }

    const providers = await Provider.findAll();

    switch (req.method) {
      case "GET":
        res.status(200).json(providers);
        break;
      case "POST":
        if (!req.body.reset && providers.length) {
          res
            .status(409)
            .send(
              "A provider ID already exists in the database. Use 'reset: true' in the body to hard reset the Providers table."
            );
        } else {
          // delete all Provider records so we only have one at all times
          await Provider.sync({ force: true });

          // Create Provider record with new ID
          const providerId = await createProviderId();
          await Provider.create({ providerId });
          res.status(201).send({ providerId });
        }

        break;
    }
  } catch (error) {
    console.error("Error inside /api/providers", error);
  }
}
