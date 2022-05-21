const resetDatabase = async (sequelize) => {
  console.log("Resetting database...");

  const {
    Team,
    Player,
    Provider,
    Season,
    Match,
    MatchRound,
    TeamMatchRounds,
    MatchRoundTeamStats,
    MatchRoundPlayerStats,
  } = sequelize.models;

  await MatchRoundPlayerStats.drop();
  await MatchRoundTeamStats.drop();
  await MatchRound.drop();
  await Match.drop();
  await Player.drop();
  await Team.drop();
  await sequelize.drop();
  await sequelize.sync({ force: true });
  return true;
};

module.exports = { resetDatabase };
