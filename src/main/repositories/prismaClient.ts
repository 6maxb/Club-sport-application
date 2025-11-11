// Fournit une instance unique du PrismaClient configurée avec l'adaptateur MariaDB
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

let prismaClient: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (prismaClient) {
    return prismaClient;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL est manquant dans l'environnement.");
  }

  const adapter = new PrismaMariaDb(databaseUrl);
  prismaClient = new PrismaClient({ adapter });
  return prismaClient;
}
