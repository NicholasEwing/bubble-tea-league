const app = require("./express/app");
const sequelize = require("./sequelize");

function assertDatabaseConnectionOk() {
  return new Promise((resolve) => {
    setTimeout(() => {
      sequelize.authenticate();
      resolve("connected to database");
    }, 1000);
  });
}

async function setup() {
  await assertDatabaseConnectionOk();
}

setup();

module.exports = app;
