import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL ?? "";
const directDatabaseUrl = process.env.DIRECT_DATABASE_URL ?? "";

const usesNeonPooler = (value) => value.includes("-pooler.");

if (!databaseUrl) {
  console.error("DATABASE_URL is required before running Prisma migrations.");
  process.exit(1);
}

if (directDatabaseUrl) {
  process.exit(0);
}

if (usesNeonPooler(databaseUrl)) {
  console.error(
    [
      "Prisma migrations should not run through a Neon pooler connection.",
      "Set DIRECT_DATABASE_URL to your Neon direct connection string, then rerun the command.",
      "Keep DATABASE_URL pointed at the pooler for normal app traffic.",
    ].join(" "),
  );
  process.exit(1);
}
