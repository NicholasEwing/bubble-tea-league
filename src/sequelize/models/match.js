const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Match", {
    bestOf: {
      type: DataTypes.ENUM,
      values: [1, 3],
      allowNull: false,
    },
  });
};
