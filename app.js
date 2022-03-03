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

exports.handler = async function (event, context) {
  // TODO: secure your RDS and set up sufficient perms
  await assertDatabaseConnectionOk();

  try {
    // reset();
    // generatePagesFromDB(sequelize);
    console.log("IM RUNNING FROM THE LAMBDA");
    console.log("EVENT: \n" + JSON.stringify(event, null, 2));
    return context.logStreamName;

    // add 5 teams to the db
    // make 5 new team pages based off those team names
  } catch (error) {
    console.log(error);
  }
};
