require("source-map-support/register");
const serverlessExpress = require("@vendia/serverless-express");
const app = require("./app");

const { reset } = require("./database/setup");

let serverlessExpressInstance;

async function resetDatabase() {
  return await reset();
}

async function setup(event, context) {
  // const result = await resetDatabase();
  // console.log(result);
  serverlessExpressInstance = serverlessExpress({ app });
  return serverlessExpressInstance(event, context);
}

function handler(event, context) {
  if (serverlessExpressInstance)
    return serverlessExpressInstance(event, context);

  return setup(event, context);
}

exports.handler = handler;
