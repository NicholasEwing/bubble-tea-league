const applyAssociations = (sequelize) => {
  const {
    Team,
    Player,
    Match,
    MatchRound,
    MatchRoundTeamStats,
    MatchRoundPlayerStats,
  } = sequelize.models;

  // Associate teams with players
  Team.hasMany(Player, { foreignKey: { allowNull: false } });
  Player.belongsTo(Team);

  // Associate matches with match rounds (ex: A best of three match can have up to three rounds)
  Match.hasMany(MatchRound);
  MatchRound.belongsTo(Match);

  // Connect blue / red teams and winners to a match
  Match.belongsTo(Team, { as: "winner" });
  Match.belongsTo(Team, { as: "red team", foreignKey: { allowNull: false } });
  Match.belongsTo(Team, { as: "blue team", foreignKey: { allowNull: false } });

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
