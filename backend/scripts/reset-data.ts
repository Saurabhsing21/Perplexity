import "dotenv/config";
import { PrismaClient } from "../prisma/generated/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DIRECT_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const messages = await prisma.message.deleteMany();
const conversations = await prisma.conversation.deleteMany();
const creditUsages = await prisma.creditUsage.deleteMany();
const users = await prisma.user.updateMany({ data: { creditsUsed: 0 } });

console.log("Reset complete:");
console.log(`  Messages deleted:          ${messages.count}`);
console.log(`  Conversations deleted:     ${conversations.count}`);
console.log(`  Credit usage records:      ${creditUsages.count}`);
console.log(`  Users credits reset:       ${users.count}`);

await prisma.$disconnect();
await pool.end();
