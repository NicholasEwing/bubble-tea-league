const sequelize = require("./sequelize");
const { generatePagesFromDB } = require("./ssr/generatePages");
const { reset } = require("./database/setup");

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
    // reset();
    generatePagesFromDB(sequelize);

    // add 5 teams to the db
    // make 5 new team pages based off those team names
  } catch (error) {
    console.log(error);
  }
}

init();
