const fs = require("fs");
const path = require("path");

const teamExample = {
  teamName: "My Cool Team",
  description: "This team is really, really cool.",
  logoImgPath: "/images/some-logo.png",
};

const distPath = path.join(path.resolve(), "../dist");

// converts html file into big string
const template = fs.readFileSync(
  path.join(path.resolve(), "../client/team.html"),
  "utf-8"
);

// does a find / replace in a big string from html file
const templatize = (template, dataObj) => {
  const { teamName, description, logoImgPath } = dataObj;
  const renderedContent = template
    .replace(/<!-- TEAM_NAME -->/g, teamName)
    .replace(/<!-- DESCRIPTION -->/g, description);
  return renderedContent;
};

const saveFile = (distfileName, contents) => {
  const dir = path.dirname(distfileName);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(distfileName, contents);
};

const getDistFilename = (filename, dataObj, distPath) => {
  const baseFilename = path.basename(filename);
  let distFilename;
  if (baseFilename === "team.html") {
    // name file after team name
    const teamName = dataObj.teamName
      .replace(/\s/g, "-")
      .concat("-team-page.html")
      .toLowerCase();
    distFilename = path.join(distPath, teamName);
  }
  return distFilename;
};

const teamHtml = path.join(path.resolve(), "../client/team.html");
const teamDistFilename = getDistFilename(teamHtml, teamExample, distPath);
const templatizedPage = templatize(template, teamExample);

module.exports = { saveFile, teamDistFilename, templatizedPage };
