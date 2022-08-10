const applyAssociations = (sequelize) => {
  const {
    Team,
    Player,
    Season,
    Match,
    MatchRound,
    MatchRoundTeamStats,
    MatchRoundPlayerStats,
  } = sequelize.models;

  // Associate matches with seasons
  Season.hasMany(Match, { foreignKey: "season" });
  Match.belongsTo(Season, { foreignKey: { name: "season", allowNull: false } });

  // Associate teams with seasons
  Season.hasMany(Team, { foreignKey: "season" });
  Team.belongsTo(Season, { foreignKey: { name: "season", allowNull: false } });

  // Associate matches with match rounds (ex: A best of three match can have up to three rounds)
  Match.hasMany(MatchRound);
  MatchRound.belongsTo(Match);

  // Associate matches with match winning teams
  Team.hasMany(Match, { foreignKey: { name: "matchWinnerTeamId" } });
  Match.belongsTo(Team, { foreignKey: { name: "matchWinnerTeamId" } });

  Team.hasMany(Match, { foreignKey: { name: "matchLoserTeamId" } });
  Match.belongsTo(Team, { foreignKey: { name: "matchLoserTeamId" } });

  Team.hasMany(Match, { foreignKey: { name: "teamOne" } });
  Match.belongsTo(Team, { foreignKey: { name: "teamTwo" } });

  // Associate winning / losing teams with match rounds
  Team.hasMany(MatchRound, {
    foreignKey: { name: "winningTeamId" },
  });
  MatchRound.belongsTo(Team, {
    foreignKey: { name: "winningTeamId" },
  });

  Team.hasMany(MatchRound, {
    foreignKey: { name: "redTeamId" },
  });
  MatchRound.belongsTo(Team, {
    foreignKey: { name: "blueTeamId" },
  });

  // Associate teams with players per season (team has one season, player can have a new team per season)
  Team.belongsToMany(Player, { through: "PlayerTeamHistory" });
  Player.belongsToMany(Team, { through: "PlayerTeamHistory" });

  // Connect team stats to a match round AND a team
  MatchRoundTeamStats.belongsTo(MatchRound, {
    foreignKey: { allowNull: false },
  });
  MatchRoundTeamStats.belongsTo(Team, { foreignKey: { allowNull: false } });

  // Connect player stats to a match round AND a player
  MatchRoundPlayerStats.belongsTo(MatchRound, {
    foreignKey: { allowNull: false },
  });
  MatchRoundPlayerStats.belongsTo(Player, { foreignKey: { allowNull: false } });
};

module.exports = applyAssociations;
