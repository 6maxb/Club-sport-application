// Repository principal pour le module réservation : validations + disponibilité terrain
import { PrismaClient } from "./prisma/generated/client";
import { getPrismaClient } from "./prismaClient";
import Reservation from "src/shared/reservation";

export class ReservationRepository {
  private dbclient: PrismaClient;

  constructor() {
    this.dbclient = getPrismaClient();
  }

  async getAll(): Promise<Reservation[]> {
    const reservations = await this.dbclient.reservation.findMany();
    // On conserve le contexte de this pour le mapping
    return reservations.map((record) => this.mapToReservation(record));
  }

  async getById(id: number): Promise<Reservation | null> {
    const reservation = await this.dbclient.reservation.findUnique({ where: { id } });
    return reservation ? this.mapToReservation(reservation) : null;
  }

  async getByMembre(membreId: number): Promise<Reservation[]> {
    const reservations = await this.dbclient.reservation.findMany({ where: { membreId } });
    return reservations.map((record) => this.mapToReservation(record));
  }

  async create(data: Omit<Reservation, "id" | "dateCreation">): Promise<Reservation> {
    await this.ensureAvailability(data.terrainId, data.dateReservation, data.heureDebut, data.heureFin);

    const created = await this.dbclient.reservation.create({
      data: {
        membreId: data.membreId,
        terrainId: data.terrainId,
        dateReservation: this.normalizeDate(data.dateReservation),
        heureDebut: this.toDateTime(data.dateReservation, data.heureDebut),
        heureFin: this.toDateTime(data.dateReservation, data.heureFin),
        statut: data.statut ?? "Confirmée",
      },
    });

    return this.mapToReservation(created);
  }

  async update(id: number, data: Partial<Omit<Reservation, "id" | "dateCreation">>): Promise<Reservation> {
    const current = await this.getById(id);
    if (!current) {
      throw new Error("Reservation introuvable");
    }

    const terrainId = data.terrainId ?? current.terrainId;
    const dateReservation = data.dateReservation ?? current.dateReservation;
    const heureDebut = data.heureDebut ?? current.heureDebut;
    const heureFin = data.heureFin ?? current.heureFin;

    await this.ensureAvailability(terrainId, dateReservation, heureDebut, heureFin, id);

    const updated = await this.dbclient.reservation.update({
      where: { id },
      data: {
        membreId: data.membreId,
        terrainId: data.terrainId,
        dateReservation: data.dateReservation
          ? this.normalizeDate(data.dateReservation)
          : undefined,
        heureDebut: data.heureDebut
          ? this.toDateTime(dateReservation, heureDebut)
          : undefined,
        heureFin: data.heureFin ? this.toDateTime(dateReservation, heureFin) : undefined,
        statut: data.statut,
      },
    });

    return this.mapToReservation(updated);
  }

  async cancel(id: number): Promise<void> {
    await this.dbclient.reservation.update({
      where: { id },
      data: { statut: "Annulée" },
    });
  }

  async delete(id: number): Promise<void> {
    await this.dbclient.reservation.delete({ where: { id } });
  }

  async checkDisponibilite(
    terrainId: number,
    date: Date,
    heureDebut: string,
    heureFin: string,
    excludeId?: number
  ): Promise<boolean> {
    // Vérifie côté base qu'aucune réservation existante ne chevauche ce créneau
    const start = this.toDateTime(date, heureDebut);
    const end = this.toDateTime(date, heureFin);

    const conflit = await this.dbclient.reservation.findFirst({
      where: {
        terrainId,
        dateReservation: this.normalizeDate(date),
        id: excludeId ? { not: excludeId } : undefined,
        statut: { not: "Annulée" },
        AND: [{ heureDebut: { lt: end } }, { heureFin: { gt: start } }],
      },
    });

    return !conflit;
  }

  private async ensureAvailability(
    terrainId: number,
    date: Date,
    heureDebut: string,
    heureFin: string,
    excludeId?: number
  ): Promise<void> {
    const disponible = await this.checkDisponibilite(terrainId, date, heureDebut, heureFin, excludeId);
    if (!disponible) {
      throw new Error("Le terrain est déjà réservé sur ce créneau.");
    }
  }

  private normalizeDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private toDateTime(date: Date, time: string): Date {
    const [hours, minutes = "0", seconds = "0"] = time.split(":");
    const base = this.normalizeDate(date);
    base.setHours(Number(hours), Number(minutes), Number(seconds), 0);
    return base;
  }

  private mapToReservation = (record: {
    id: number;
    membreId: number;
    terrainId: number;
    dateReservation: Date;
    heureDebut: Date;
    heureFin: Date;
    statut: string;
    dateCreation: Date;
  }): Reservation => ({
    id: record.id,
    membreId: record.membreId,
    terrainId: record.terrainId,
    dateReservation: record.dateReservation,
    heureDebut: record.heureDebut.toTimeString().slice(0, 8),
    heureFin: record.heureFin.toTimeString().slice(0, 8),
    statut: record.statut,
    dateCreation: record.dateCreation,
  });
}
