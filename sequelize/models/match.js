const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Match", {
    isPlayoffsMatch: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });
};
