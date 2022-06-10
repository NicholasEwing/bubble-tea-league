const sequelize = require("../sequelize/index");

const makeTables = async () => {
  await sequelize.sync({ force: true });
  return true;
};

const globalSetup = async () => {
  try {
    await makeTables();
  } catch (error) {
    console.error("Global setup error:", error);
  }
};

module.exports = globalSetup;
