import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import dotenv from 'dotenv';
dotenv.config();

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to initialize Prisma");
}

const adapter = new PrismaPg(new Pool({ connectionString }));

if (process.env.NODE_ENV !== "production") {
  if (!global.prismaGlobal) {
    global.prismaGlobal = new PrismaClient({ adapter });
  }
}

const prisma = global.prismaGlobal ?? new PrismaClient({ adapter });

export default prisma;

// Updated test function to use the existing PrismaClient instance
// async function testSessionTable() {
//   try {
//     const sessions = await prisma.session.findMany();
//     console.log('Session table data:', sessions);
//   } catch (error) {
//     console.error('Error accessing Session table:', error);
//   }
// }

// //testSessionTable();
