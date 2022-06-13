import Sequelize from "sequelize";
import applyAssociations from "./applyAssociations.js";
import config from "./config/config.js";

let database, username, password, host, port, dialect;

if (process.env.NODE_ENV === "test") {
  ({ database, username, password, host, port, dialect } = config.test);
} else if (process.env.NODE_ENV === "development") {
  ({ database, username, password, host, port, dialect } = config.development);
}

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect,
  query: { raw: true },
});

// Define all models and then attaches them to sequelize.models
const modelDefiners = [
  import("./models/team.js"),
  import("./models/provider.js"),
  import("./models/season.js"),
  import("./models/player.js"),
  import("./models/match.js"),
  import("./models/matchRound.js"),
  import("./models/matchRoundTeamStats.js"),
  import("./models/matchRoundPlayerStats.js"),
];

for await (const { default: modelDefiner } of modelDefiners) {
  modelDefiner(sequelize);
}

// Apply our associations to all models
applyAssociations(sequelize);

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Connection has been established successfully.");
//   })
//   .catch((err) => {
//     console.log("Unable to connect to the database:", err);
//   });

// export the sequelize instance to be used elsewhere
export default sequelize;
