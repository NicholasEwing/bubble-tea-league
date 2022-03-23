const app = require("./src/express/app");
const serverlessExpress = require("@vendia/serverless-express");
const sequelize = require("./src/sequelize");
const { generatePagesFromDB } = require("./src/ssr/generatePages");
const { reset } = require("./src/database/setup");
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

// assertDatabaseConnectionOk();
// reset();
// generatePagesFromDB(sequelize);

exports.handler = serverlessExpress({ app });

// exports.handler = async function (event, context) {
//   await assertDatabaseConnectionOk();

//   try {
//     reset();
//     // generatePagesFromDB(sequelize);
//     console.log("IM RUNNING FROM THE LAMBDA");
//     console.log("EVENT: \n" + JSON.stringify(event, null, 2));

//     // API Gateway handles requests, we don't need this.
//     // app.listen(PORT, () => {
//     //   console.log(
//     //     `Express server started on port ${PORT}. Try hitting some routes!`
//     //   );
//     // });

//     // add 5 teams to the db
//     // make 5 new team pages based off those team names
//   } catch (error) {
//     console.log(error);
//   }
// };
