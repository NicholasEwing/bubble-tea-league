import { DataTypes } from "sequelize";

export default (sequelize) => {
  sequelize.define("MatchRound", {
    gameId: {
      // use for the v5-match API
      type: DataTypes.STRING,
    },
    tournamentCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    metaData: {
      type: DataTypes.STRING,
    },
  });
};
