const applyAssociations = (sequelize) => {
  const {
    Team,
    Player,
    Season,
    Match,
    MatchRound,
    MatchRoundTeamStats,
    MatchRoundPlayerStats,
    TournamentCode,
  } = sequelize.models;

  // Associate matches with seasons
  Season.hasMany(Match, { foreignKey: "season" });
  Match.belongsTo(Season, { foreignKey: "season" });

  // Associate teams with seasons
  Season.hasMany(Team, { foreignKey: "season" });
  Team.belongsTo(Season, { foreignKey: { name: "season", allowNull: false } });

  // Associate matches with match rounds (ex: A best of three match can have up to three rounds)
  Match.hasMany(MatchRound);
  MatchRound.belongsTo(Match);

  // Associate matches with match winning teams
  Team.hasMany(Match, { foreignKey: { name: "matchWinnerTeamId" } });
  Match.belongsTo(Team, { foreignKey: { name: "matchWinnerTeamId" } });

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

  // Associate teams with players
  Team.hasMany(Player, { foreignKey: { allowNull: false } });
  Player.belongsTo(Team);

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
