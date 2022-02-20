const sequelize = require("./sequelize");

async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection...`);
  try {
    await sequelize.authenticate();
    console.log("Database connection OK!");
  } catch (error) {
    console.log("Unable to connect to the database:");
    console.log(error.message);
    process.exit(1);
  }
}

async function init() {
  await assertDatabaseConnectionOk();

  try {
    // uncomment sync sequelize to create any new models
    // await sequelize.sync({ force: true });
    // add a team to the db
    // make a new team page based off the team name
    // add 5 teams to the db
    // make 5 new team pages based off those team names
  } catch (error) {
    console.log(error);
  }
}

init();
