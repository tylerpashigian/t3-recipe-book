import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient; //eslint-disable-line no-var
}

if (!global.prisma) {
  global.prisma = new PrismaClient();
}

export default global.prisma;
