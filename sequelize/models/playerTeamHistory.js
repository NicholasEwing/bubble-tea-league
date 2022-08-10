const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("PlayerTeamHistory", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  });
};
