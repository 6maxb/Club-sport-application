// Encapsule les accès Prisma pour les adresses (CRUD + mapping vers l'interface partagée)
import { PrismaClient } from "@prisma/client";
import { getPrismaClient } from "./prismaClient";
import Adresse from "src/shared/adresse";

export class AdresseRepository {
  private dbclient: PrismaClient;

  constructor() {
    this.dbclient = getPrismaClient();
  }

  async getAll(): Promise<Adresse[]> {
    const adresses = await this.dbclient.adresse.findMany();
    // On passe par une fonction fléchée pour préserver le contexte (this) lors du mapping
    return adresses.map((record) => this.mapToAdresse(record));
  }

  async getById(id: number): Promise<Adresse | null> {
    const adresse = await this.dbclient.adresse.findUnique({
      where: { id },
    });
    return adresse ? this.mapToAdresse(adresse) : null;
  }

  async create(data: Omit<Adresse, "id">): Promise<Adresse> {
    const created = await this.dbclient.adresse.create({
      data: {
        rue: data.rue,
        codePostal: data.codePostal,
        ville: data.ville,
        pays: data.pays,
      },
    });
    return this.mapToAdresse(created);
  }

  async update(id: number, data: Partial<Omit<Adresse, "id">>): Promise<Adresse> {
    const updated = await this.dbclient.adresse.update({
      where: { id },
      data: {
        rue: data.rue,
        codePostal: data.codePostal,
        ville: data.ville,
        pays: data.pays,
      },
    });
    return this.mapToAdresse(updated);
  }

  async delete(id: number): Promise<void> {
    await this.dbclient.adresse.delete({
      where: { id },
    });
  }

  private mapToAdresse = (record: { id: number; rue: string; codePostal: string; ville: string; pays: string }): Adresse => ({
    id: record.id,
    rue: record.rue,
    codePostal: record.codePostal,
    ville: record.ville,
    pays: record.pays,
  });
}
