// Centralise les règles métiers liées aux paiements (un seul lien possible et montant positif)
import { PrismaClient } from "./prisma/generated/client";
import { getPrismaClient } from "./prismaClient";
import Paiement from "src/shared/paiement";

export class PaiementRepository {
  private dbclient: PrismaClient;

  constructor() {
    this.dbclient = getPrismaClient();
  }

  async getAll(): Promise<Paiement[]> {
    const paiements = await this.dbclient.paiement.findMany({ orderBy: { datePaiement: "desc" } });
    // On utilise une fonction fléchée pour garder le contexte `this` lors du mapping
    return paiements.map((record) => this.mapToPaiement(record));
  }

  async getById(id: number): Promise<Paiement | null> {
    const paiement = await this.dbclient.paiement.findUnique({ where: { id } });
    return paiement ? this.mapToPaiement(paiement) : null;
  }

  async getByAdhesion(adhesionId: number): Promise<Paiement[]> {
    const paiements = await this.dbclient.paiement.findMany({
      where: { adhesionId },
      orderBy: { datePaiement: "desc" },
    });
    return paiements.map((record) => this.mapToPaiement(record));
  }

  async getByReservation(reservationId: number): Promise<Paiement[]> {
    const paiements = await this.dbclient.paiement.findMany({
      where: { reservationId },
      orderBy: { datePaiement: "desc" },
    });
    return paiements.map((record) => this.mapToPaiement(record));
  }

  async getByCours(coursId: number): Promise<Paiement[]> {
    const paiements = await this.dbclient.paiement.findMany({
      where: { coursId },
      orderBy: { datePaiement: "desc" },
    });
    return paiements.map((record) => this.mapToPaiement(record));
  }

  async create(data: Omit<Paiement, "id">): Promise<Paiement> {
    this.ensurePaiementUnique(data);
    this.ensureMontantPositif(data);

    const created = await this.dbclient.paiement.create({
      data: {
        adhesionId: data.adhesionId ?? null,
        reservationId: data.reservationId ?? null,
        coursId: data.coursId ?? null,
        montant: data.montant,
        datePaiement: data.datePaiement,
        typePaiement: data.typePaiement ?? null,
        modePaiement: data.modePaiement ?? null,
      },
    });
    return this.mapToPaiement(created);
  }

  async delete(id: number): Promise<void> {
    await this.dbclient.paiement.delete({ where: { id } });
  }

  private ensurePaiementUnique(data: Omit<Paiement, "id">): void {
    const targets = [data.adhesionId, data.reservationId, data.coursId].filter((value) => value !== undefined && value !== null);
    if (targets.length !== 1) {
      throw new Error("Un paiement doit concerner exactement une entité (adhésion, réservation ou cours).");
    }
  }

  private ensureMontantPositif(data: Omit<Paiement, "id">): void {
    if (data.montant <= 0) {
      throw new Error("Le montant du paiement doit être strictement positif.");
    }
  }

  private mapToPaiement = (record: {
    id: number;
    adhesionId: number | null;
    reservationId: number | null;
    coursId: number | null;
    montant: any;
    datePaiement: Date;
    typePaiement: string | null;
    modePaiement: string | null;
  }): Paiement => ({
    id: record.id,
    adhesionId: record.adhesionId ?? undefined,
    reservationId: record.reservationId ?? undefined,
    coursId: record.coursId ?? undefined,
    montant: Number(record.montant),
    datePaiement: record.datePaiement,
    typePaiement: record.typePaiement ?? undefined,
    modePaiement: record.modePaiement ?? undefined,
  });
}
