import S3 from "aws-sdk/clients/s3";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import admins from "../../../admins";
import path from "node:path";
import { prisma } from "../../../prisma/db";

export default async function handler(req, res) {
  if (process.env.NODE_ENV === "production") {
    const session = await unstable_getServerSession(req, res, authOptions);
    const userIsAdmin = admins.includes(session?.user?.email);
    if (!userIsAdmin) res.status(401).end();
  }

  // save img path into prisma db
  const { teamId, file, fileType } = req.query;
  const team = await prisma.team.findUniqueOrThrow({
    where: {
      id: parseInt(teamId),
    },
  });
  const extName = path.extname(file).toLowerCase();
  const fileName = `teams/${team.tricode.toLowerCase()}${extName}`;
  await prisma.team.update({
    where: {
      id: parseInt(teamId),
    },
    data: {
      logoImgPath: `/${fileName}`,
    },
  });

  const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  });

  const post = await s3.createPresignedPost({
    Bucket: process.env.BUCKET_NAME,
    Fields: {
      key: fileName,
      "Content-Type": fileType,
    },
    Expires: 60, // seconds
    Conditions: [
      ["content-length-range", 0, 8000000], // up to ~8 MB
    ],
  });

  res.status(200).json(post);
}
