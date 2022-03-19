const app = require("./express/app");
const sequelize = require("./sequelize");
const { generatePagesFromDB } = require("./ssr/generatePages");
const { reset } = require("./database/setup");
const PORT = 8080;

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
  await assertDatabaseConnectionOk();

  try {
    reset();
    // generatePagesFromDB(sequelize);
    console.log("IM RUNNING FROM THE LAMBDA");
    console.log("EVENT: \n" + JSON.stringify(event, null, 2));

    app.listen(PORT, () => {
      console.log(
        `Express server started on port ${PORT}. Try hitting some routes!`
      );
    });

    // add 5 teams to the db
    // make 5 new team pages based off those team names
  } catch (error) {
    console.log(error);
  }
};
