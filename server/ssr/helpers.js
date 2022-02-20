const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

// static dist path
const distPath = path.join(path.resolve(), "../dist");

// clean up filename
const formatFilename = (filename) => {
  return filename.trim().replace(/\s/g, "-").concat(".html").toLowerCase();
};

// slot info into template page
const buildHTML = (template, dataValues) => {
  const source = fs.readFileSync(template, "utf8").toString();
  const templatedPage = Handlebars.compile(source);
  const output = templatedPage(dataValues);

  return output;
};

// saves a file
const saveFile = (distFilePath, html) => {
  const dir = path.dirname(distFilePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(distFilePath, html);
};

module.exports = { distPath, formatFilename, buildHTML, saveFile };
