import sequelize from "../sequelize/index.js";

const makeTables = async () => {
  if (process.env.NODE_ENV === "test") {
    await sequelize.sync({ force: true });
  }
};

export default makeTables;
