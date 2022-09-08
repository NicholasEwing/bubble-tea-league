import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import formidable from "formidable";
import fs from "fs";
import admins from "../../../admins";
import { prisma } from "../../../prisma/db";
import path from "node:path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const saveFile = async (file, fileName) => {
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(`./public${fileName}`, data);
  await fs.unlinkSync(file.filepath);
  return;
};

export default async function handler(req, res) {
  if (process.env.NODE_ENV === "production") {
    const session = await unstable_getServerSession(req, res, authOptions);
    const userIsAdmin = admins.includes(session?.user?.email);
    if (!userIsAdmin) res.status(401).end();
  }

  switch (req.method) {
    case "POST":
      try {
        const form = new formidable.IncomingForm();
        form.parse(req, async function (err, fields, files) {
          if (err) {
            res.status(409).send(err);
          }
          const { file } = files;
          const { id } = fields;
          const team = await prisma.team.findUniqueOrThrow({
            where: {
              id: parseInt(id),
            },
          });
          const extName = path.extname(file.originalFilename).toLowerCase();
          const fileName = `/teams/${team.tricode.toLowerCase()}${extName}`;

          await saveFile(file, fileName);
          await prisma.team.update({
            where: {
              id: parseInt(id),
            },
            data: {
              logoImgPath: fileName,
            },
          });
          res.status(201).end();
        });
      } catch (error) {
        res.status(409).send(error);
      }
      break;
  }
}
