import sequelize from "../sequelize/index.js";
import pkg from "@next/env";
const { loadEnvConfig } = pkg;

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

export default globalSetup;
