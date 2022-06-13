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
    foreignKey: { name: "losingTeamId" },
  });

  // Associate winning / losing teams with match rounds
  // Team.belongsToMany(MatchRound, { through: "TeamMatchRounds" });
  // MatchRound.belongsToMany(Team, { through: "TeamMatchRounds" });

  // Associate teams with players
  Team.hasMany(Player, { foreignKey: { allowNull: false } });
  Player.belongsTo(Team);

  // Connect two teams to a match with a foreign key for a winning team
  // Team.hasMany(Match, { foreignKey: { name: "winner" } });
  // Match.belongsTo(Team, {
  //   foreignKey: {
  //     allowNull: false,
  //     name: "teamOne",
  //   },
  // });
  // Match.belongsTo(Team, {
  //   foreignKey: {
  //     allowNull: false,
  //     name: "teamTwo",
  //   },
  // });

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

export default applyAssociations;
