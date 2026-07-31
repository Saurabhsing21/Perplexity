import "dotenv/config";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DIRECT_URL });

async function main() {
  const client = await pool.connect();
  try {
    await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "supabaseId" TEXT`);
    await client.query(`UPDATE "User" SET "supabaseId" = COALESCE("supabaseId", id::text) WHERE "supabaseId" IS NULL`);
    await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "creditsUsed" INTEGER NOT NULL DEFAULT 0`);
    await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "creditLimit" INTEGER NOT NULL DEFAULT 10`);
    await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "plan" TEXT NOT NULL DEFAULT 'Free'`);
    await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    await client.query(`CREATE TABLE IF NOT EXISTS "CreditUsage" (
      "id" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "action" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "CreditUsage_pkey" PRIMARY KEY ("id")
    )`);
    console.log("Schema columns backfilled for legacy database");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
