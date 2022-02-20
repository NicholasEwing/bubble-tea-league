const path = require("path");
const { distPath, formatFilename, buildHTML, saveFile } = require("../helpers");

const generateTeamPages = async (models) => {
  const pathToTeamPageTemplate = path.join(
    path.resolve(),
    "../client/team.html"
  );

  const { Team, Player } = models; // add players and other needed info later

  // TODO: Find a way to pull teams WITH players per team with a SINGLE query!!!!
  // for each team, make a team page
  const teams = await Team.findAll({ include: Player, raw: true });
  // const players = await Player.findAll({ raw: true });

  for (const team of teams) {
    const { teamName, id } = team;
    // find players on this team, attach them to our team
    // team.players = players.filter((player) => player.TeamId === id);

    // slot info into template page
    const html = buildHTML(pathToTeamPageTemplate, team);

    // rename new file and create file path to save to
    const formattedFilename = formatFilename(teamName);
    const distFilePath = path.join(distPath, formattedFilename);

    // save file
    saveFile(distFilePath, html);
  }
};

module.exports = { generateTeamPages };
