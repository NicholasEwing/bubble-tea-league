require("dotenv").config();
const mysql = require("mysql2/promise");
const Sequelize = require("sequelize");
const applyAssociations = require("./applyAssociations");

const createTable = async () => {
  try {
    // Create table if it doesn't already exist
    const host = process.env.RDS_HOST;
    const port = 3306;
    const user = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;

    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS btl_db`);
    return initSequelize();
  } catch (error) {
    console.log("Error creating table.");
    console.log(error);
  }
};

const initSequelize = async () => {
  // Register AWS DB creds and create new sequelize instance
  const sequelize = new Sequelize(
    "btl_db",
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.RDS_HOST,
      port: 3306,
      dialect: "mysql",
    }
  );

  // Define all models and then attaches them to sequelize.models
  const modelDefiners = [
    require("./models/team"),
    require("./models/player"),
    require("./models/match"),
    require("./models/matchRound"),
    require("./models/matchRoundTeamStats"),
    require("./models/matchRoundPlayerStats"),
  ];

  for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
  }

  // Apply our associations to all models
  applyAssociations(sequelize);

  return sequelize;
};

const sequelize = createTable();

// export the sequelize instance to be used elsewhere
module.exports = sequelize;
