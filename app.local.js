const app = require("./src/app");
const sequelize = require("./src/sequelize");
const { reset } = require("./src/database/setup");

const port = 3002;

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
  // await reset();

  console.log(`Starting Sequelize + Express example on port ${port}...`);

  app.listen(port, () => {
    console.log(`Express server started on port ${port}. Try some routes!`);
  });
}

init();
