require("dotenv").config();
const Sequelize = require("sequelize");

// connect to aws database
const sequelize = new Sequelize(
  "bubble_tea_league",
  process.env.USERNAME,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    port: 3306,
    dialect: "mysql",
  }
);

module.exports = sequelize;
