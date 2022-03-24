require("source-map-support/register");
const serverlessExpress = require("@vendia/serverless-express");
const sequelize = require("./sequelize");
const app = require("./app");

let serverlessExpressInstance;

function assertDatabaseConnectionOk() {
  return new Promise((resolve) => {
    setTimeout(() => {
      sequelize.authenticate();
      resolve("connected to database");
    }, 1000);
  });
}

async function setup(event, context) {
  await assertDatabaseConnectionOk();
  serverlessExpressInstance = serverlessExpress({ app });
  console.log("--------------- Serverless express instance: ---------------");
  console.log(serverlessExpressInstance);
  return serverlessExpressInstance(event, context);
}

function handler(event, context) {
  if (serverlessExpressInstance)
    return serverlessExpressInstance(event, context);

  return setup(event, context);
}

exports.handler = handler;
