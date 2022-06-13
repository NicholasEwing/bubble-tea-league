const sequelize = require("../sequelize/index");
import { loadEnvConfig } from "@next/env";

const makeTables = async () => {
  await sequelize.sync({ force: true });
  return true;
};

const globalSetup = async () => {
  try {
    const projectDir = process.cwd();
    loadEnvConfig(projectDir);
    await makeTables();
  } catch (error) {
    console.error("Global setup error:", error);
  }
};

module.exports = globalSetup;
