// const applyAssociations = (sequelize) => {
//   const {
//     Team,
//     Player,
//     Season,
//     Match,
//     MatchRound,
//     MatchRoundTeamStats,
//     MatchRoundPlayerStats,
//     TeamStanding,
//   } = sequelize.models;

//   // Associate matches with seasons
//   Season.hasMany(Match, { foreignKey: "season" });
//   Match.belongsTo(Season, { foreignKey: "season", constraints: false });

//   // Associate teams with seasons
//   Season.hasMany(Team, { foreignKey: "season" });
//   Team.belongsTo(Season, { foreignKey: "season", constraints: false });

//   // Associate matches with match rounds (ex: A best of three match can have up to three rounds)
//   Match.hasMany(MatchRound);
//   MatchRound.belongsTo(Match, { constraints: false });

//   // Associate matches with match winning teams
//   Team.hasMany(Match, { foreignKey: "matchWinnerTeamId" });
//   Match.belongsTo(Team, {
//     foreignKey: "matchWinnerTeamId",
//     constraints: false,
//   });

//   Team.hasMany(Match, { foreignKey: "matchLoserTeamId" });
//   Match.belongsTo(Team, { foreignKey: "matchLoserTeamId", constraints: false });

//   Team.hasMany(Match, { foreignKey: "teamOne" });
//   Match.belongsTo(Team, { foreignKey: "teamTwo", constraints: false });

//   // Keep track of seasonal team standings
//   Team.hasOne(TeamStanding);
//   TeamStanding.belongsTo(Team, { constraints: false });

//   // Associate winning / losing teams with match rounds
//   Team.hasMany(MatchRound, {
//     foreignKey: "winningTeamId",
//   });
//   MatchRound.belongsTo(Team, {
//     foreignKey: "winningTeamId",
//     constraints: false,
//   });

//   Team.hasMany(MatchRound, {
//     foreignKey: "redTeamId",
//   });
//   MatchRound.belongsTo(Team, {
//     foreignKey: "blueTeamId",
//     constraints: false,
//   });

//   // Associate teams with players per season (team has one season, player can have a new team per season)
//   Team.belongsToMany(Player, {
//     through: "PlayerTeamHistory",
//     contraints: false,
//   });
//   Player.belongsToMany(Team, {
//     through: "PlayerTeamHistory",
//     constraints: false,
//   });

//   // Connect team stats to a match round AND a team
//   MatchRoundTeamStats.belongsTo(MatchRound, { constraints: false });
//   MatchRoundTeamStats.belongsTo(Team, { constraints: false });

//   // Connect player stats to a match round AND a player
//   MatchRoundPlayerStats.belongsTo(MatchRound, { constraints: false });
//   MatchRoundPlayerStats.belongsTo(Player, { constraints: false });
// };

// module.exports = applyAssociations;
