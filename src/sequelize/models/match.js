const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Match", {
    date: {
      type: DataTypes.DATE,
    },
    bestOf: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  });
};
