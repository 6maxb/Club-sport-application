// Repository Prisma pour les adhésions : expose les requêtes et le mapping vers le modèle partagé
import { PrismaClient } from "./prisma/generated/client";
import { getPrismaClient } from "./prismaClient";
import Adhesion from "src/shared/adhesion";

export class AdhesionRepository {
  private dbclient: PrismaClient;

  constructor() {
    this.dbclient = getPrismaClient();
  }

  async getAll(): Promise<Adhesion[]> {
    const adhesions = await this.dbclient.adhesion.findMany();
    // Préserve le contexte en utilisant une fonction fléchée pour le mapping
    return adhesions.map((record) => this.mapToAdhesion(record));
  }

  async getById(id: number): Promise<Adhesion | null> {
    const adhesion = await this.dbclient.adhesion.findUnique({ where: { id } });
    return adhesion ? this.mapToAdhesion(adhesion) : null;
  }

  async getByMembre(membreId: number): Promise<Adhesion[]> {
    const adhesions = await this.dbclient.adhesion.findMany({ where: { membreId } });
    return adhesions.map((record) => this.mapToAdhesion(record));
  }

  async getActiveByMembre(membreId: number): Promise<Adhesion | null> {
    const today = new Date();
    // Cherche la dernière adhésion encore valide pour le membre (début <= aujourd'hui <= fin)
    const adhesion = await this.dbclient.adhesion.findFirst({
      where: {
        membreId,
        dateDebut: { lte: today },
        dateFin: { gte: today },
      },
      orderBy: { dateFin: "desc" },
    });
    return adhesion ? this.mapToAdhesion(adhesion) : null;
  }

  async create(data: Omit<Adhesion, "id">): Promise<Adhesion> {
    const created = await this.dbclient.adhesion.create({
      data: {
        membreId: data.membreId,
        type: data.type,
        dateDebut: data.dateDebut,
        dateFin: data.dateFin,
      },
    });
    return this.mapToAdhesion(created);
  }

  async update(id: number, data: Partial<Omit<Adhesion, "id">>): Promise<Adhesion> {
    const updated = await this.dbclient.adhesion.update({
      where: { id },
      data: {
        membreId: data.membreId,
        type: data.type,
        dateDebut: data.dateDebut,
        dateFin: data.dateFin,
      },
    });
    return this.mapToAdhesion(updated);
  }

  async delete(id: number): Promise<void> {
    await this.dbclient.adhesion.delete({ where: { id } });
  }

  private mapToAdhesion = (record: {
    id: number;
    membreId: number;
    type: string;
    dateDebut: Date;
    dateFin: Date;
  }): Adhesion => ({
    id: record.id,
    membreId: record.membreId,
    type: record.type,
    dateDebut: record.dateDebut,
    dateFin: record.dateFin,
  });
}
