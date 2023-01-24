import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["warn", "error"],
    errorFormat: process.env.NODE_ENV === "production" ? "minimal" : "pretty",
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
