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
        try {
          const form = new formidable.IncomingForm();
          form.parse(req, async function (err, fields, files) {
            const { file } = files;
            const { id } = fields;
            const team = await Team.findByPk(id);
            const oldImage = team.logoImgPath;
            const newImage = file.originalFilename;

            if (oldImage) fs.unlinkSync(`./public${oldImage}`);

            await saveFile(file);
            await team.update({
              logoImgPath: `/teams/${newImage}`,
            });
          });
          res.status(201).end();
        } catch (error) {
          res.status(409).send({ error });
        }
        break;
    }
  } catch (error) {
    console.error("Error inside /api/teams/upload", error);
  }
}
