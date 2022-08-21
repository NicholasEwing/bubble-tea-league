const sequelize = require("../../../sequelize");
const { Team } = sequelize.models;

import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const saveFile = async (file) => {
  const data = fs.readFileSync(file.filepath);

  fs.writeFileSync(`./public/teams/${file.originalFilename}`, data);
  await fs.unlinkSync(file.filepath);
  return;
};

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "POST":
        console.log("hit upload end point for teams");
        const form = new formidable.IncomingForm();
        form.parse(req, async function (err, fields, files) {
          const { file } = files;
          const { id } = fields;
          const team = await Team.findByPk(id);

          await team.update({
            logoImgPath: `/teams/${file.originalFilename}`,
          });

          await saveFile(file);
        });
        res.status(201).end();
        break;
    }
  } catch (error) {
    console.error("Error inside /api/teams/upload", error);
  }
}
