// Gestion des terrains : CRUD Prisma + utilitaire pour la disponibilité
import { PrismaClient } from "./prisma/generated/client";
import { getPrismaClient } from "./prismaClient";
import Terrain from "src/shared/terrain";

export class TerrainRepository {
  private dbclient: PrismaClient;

  constructor() {
    this.dbclient = getPrismaClient();
  }

  async getAll(): Promise<Terrain[]> {
    const terrains = await this.dbclient.terrain.findMany();
    // On garde le bon contexte pour mapToTerrain avec une fonction fléchée
    return terrains.map((record) => this.mapToTerrain(record));
  }

  async getById(id: number): Promise<Terrain | null> {
    const terrain = await this.dbclient.terrain.findUnique({ where: { id } });
    return terrain ? this.mapToTerrain(terrain) : null;
  }

  async create(data: Omit<Terrain, "id">): Promise<Terrain> {
    const created = await this.dbclient.terrain.create({
      data: {
        nom: data.nom,
        surface: data.surface ?? null,
        couvert: data.couvert,
        eclairage: data.eclairage,
        localisation: data.localisation ?? null,
      },
    });
    return this.mapToTerrain(created);
  }

  async update(id: number, data: Partial<Omit<Terrain, "id">>): Promise<Terrain> {
    const updated = await this.dbclient.terrain.update({
      where: { id },
      data: {
        nom: data.nom,
        surface: data.surface,
        couvert: data.couvert,
        eclairage: data.eclairage,
        localisation: data.localisation,
      },
    });
    return this.mapToTerrain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.dbclient.terrain.delete({ where: { id } });
  }

  async getDisponibles(date: Date, heureDebut: string, heureFin: string): Promise<Terrain[]> {
    // Filtre sur les terrains qui n'ont pas de réservation qui se chevauche
    const terrains = await this.dbclient.terrain.findMany({
      where: {
        reservations: {
          none: {
            dateReservation: date,
            OR: [
              {
                heureDebut: { lte: new Date(`${date.toISOString().split("T")[0]}T${heureFin}`) },
                heureFin: { gt: new Date(`${date.toISOString().split("T")[0]}T${heureDebut}`) },
              },
            ],
          },
        },
      },
    });
    // Même commentaire : conservation de `this` lors du mapping
    return terrains.map((record) => this.mapToTerrain(record));
  }

  private mapToTerrain = (record: {
    id: number;
    nom: string;
    surface: any;
    couvert: boolean;
    eclairage: boolean;
    localisation: string | null;
  }): Terrain => ({
    id: record.id,
    nom: record.nom,
    surface: record.surface ? Number(record.surface) : undefined,
    couvert: record.couvert,
    eclairage: record.eclairage,
    localisation: record.localisation ?? undefined,
  });
}
