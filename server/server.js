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

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected!");
  })
  .catch((error) => console.log(error));

// add a team to the db

// pull team name from the db, make a team

// add 5 teams to the db

// write logic to create all 5 teams, organize the staticGen logic into a class for each template
