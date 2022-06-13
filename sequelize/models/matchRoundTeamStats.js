import { DataTypes } from "sequelize";

export default (sequelize) => {
  sequelize.define("MatchRoundTeamStats", {
    kills: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    goldEarned: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    towersDestroyed: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    heraldsKilled: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    dragonsKilled: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  });
};
