require("source-map-support").install();
const serverlessExpress = require("@vendia/serverless-express");
const app = require("./app");

exports.handler = serverlessExpress({ app });
