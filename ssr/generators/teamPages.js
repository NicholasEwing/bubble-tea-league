const path = require("path");
const { distPath, formatFilename, buildHTML, saveFile } = require("../helpers");

const generateTeamPages = async (models) => {
  const pathToTeamPageTemplate = path.join(
    path.resolve(),
    "../client/team.hbs"
  );

  const { Team, Player } = models; // add players and other needed info later

  // for each team, make a team page
  const teams = await Team.findAll({ include: Player });

  for (const team of teams) {
    const { teamName, id } = team;

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
