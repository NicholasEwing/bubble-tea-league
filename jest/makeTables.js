const sequelize = require("../sequelize/index");

const makeTables = async () => {
  if (process.env.NODE_ENV === "test") {
    await sequelize.sync({ force: true });
  }
};

module.exports = makeTables;
