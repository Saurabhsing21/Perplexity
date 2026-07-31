import "dotenv/config";
import { PrismaClient } from "../../prisma/generated/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Use a global variable to prevent multiple instances during hot-reloading in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
