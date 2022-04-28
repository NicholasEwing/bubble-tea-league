const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Match", {
    bestOf: {
      type: DataTypes.ENUM,
      values: ["1", "3"], // always wrap enum values in quotes to avoid MySQL syntax error
      allowNull: false,
    },
  });
};
