// Contient la logique métier des cours : gestion des participants, animateurs et conflits de planning
import { PrismaClient } from "@prisma/client";
import { getPrismaClient } from "./prismaClient";
import Cours from "src/shared/cours";

export class CoursRepository {
  private dbclient: PrismaClient;

  constructor() {
    this.dbclient = getPrismaClient();
  }

  async getAll(): Promise<Cours[]> {
    const cours = await this.dbclient.cours.findMany({ orderBy: { dateHeure: "asc" } });
    // Fonction fléchée pour conserver le contexte `this`
    return cours.map((record) => this.mapToCours(record));
  }

  async getById(id: number): Promise<Cours | null> {
    const cours = await this.dbclient.cours.findUnique({ where: { id } });
    return cours ? this.mapToCours(cours) : null;
  }

  async getByNiveau(niveau: string): Promise<Cours[]> {
    const cours = await this.dbclient.cours.findMany({
      where: { niveau },
      orderBy: { dateHeure: "asc" },
    });
    return cours.map((record) => this.mapToCours(record));
  }

  async create(data: Omit<Cours, "id">): Promise<Cours> {
    await this.ensureTerrainDisponible(data.terrainId, data.dateHeure, data.duree);

    const created = await this.dbclient.cours.create({
      data: {
        terrainId: data.terrainId,
        titre: data.titre,
        niveau: data.niveau,
        dateHeure: data.dateHeure,
        duree: data.duree,
        capacite: data.capacite,
      },
    });
    return this.mapToCours(created);
  }

  async update(id: number, data: Partial<Omit<Cours, "id">>): Promise<Cours> {
    const current = await this.getById(id);
    if (!current) {
      throw new Error("Cours introuvable");
    }

    const terrainId = data.terrainId ?? current.terrainId;
    const dateHeure = data.dateHeure ?? current.dateHeure;
    const duree = data.duree ?? current.duree;
    await this.ensureTerrainDisponible(terrainId, dateHeure, duree, id);

    if (data.capacite !== undefined) {
      const participantsCount = await this.dbclient.participe.count({ where: { coursId: id } });
      if (data.capacite < participantsCount) {
        throw new Error("La nouvelle capacité est inférieure au nombre de participants inscrits.");
      }
    }

    const updated = await this.dbclient.cours.update({
      where: { id },
      data: {
        terrainId: data.terrainId,
        titre: data.titre,
        niveau: data.niveau,
        dateHeure: data.dateHeure,
        duree: data.duree,
        capacite: data.capacite,
      },
    });
    return this.mapToCours(updated);
  }

  async delete(id: number): Promise<void> {
    await this.dbclient.cours.delete({ where: { id } });
  }

  async inscrireParticipant(coursId: number, membreId: number): Promise<void> {
    const cours = await this.getById(coursId);
    if (!cours) {
      throw new Error("Cours introuvable");
    }

    const existe = await this.dbclient.participe.findUnique({
      where: {
        membreId_coursId: {
          membreId,
          coursId,
        },
      },
    });
    if (existe) {
      throw new Error("Le membre est déjà inscrit à ce cours.");
    }

    const count = await this.dbclient.participe.count({ where: { coursId } });
    if (count >= cours.capacite) {
      throw new Error("Capacité maximale atteinte pour ce cours.");
    }

    await this.dbclient.participe.create({
      data: {
        coursId,
        membreId,
      },
    });
  }

  async desinscrireParticipant(coursId: number, membreId: number): Promise<void> {
    await this.dbclient.participe.delete({
      where: {
        membreId_coursId: {
          membreId,
          coursId,
        },
      },
    });
  }

  async assignerEntraineur(coursId: number, membreId: number, role = "Principal", remuneration?: number): Promise<void> {
    const membre = await this.dbclient.membre.findUnique({ where: { id: membreId } });
    if (!membre || !membre.estEntraineur) {
      throw new Error("Seuls les membres entraîneurs peuvent être assignés.");
    }

    await this.dbclient.anime.upsert({
      where: {
        membreId_coursId: {
          membreId,
          coursId,
        },
      },
      update: {
        role,
        remuneration: remuneration ?? null,
      },
      create: {
        coursId,
        membreId,
        role,
        remuneration: remuneration ?? null,
      },
    });
  }

  async retirerEntraineur(coursId: number, membreId: number): Promise<void> {
    await this.dbclient.anime.delete({
      where: {
        membreId_coursId: {
          membreId,
          coursId,
        },
      },
    });
  }

  private async ensureTerrainDisponible(
    terrainId: number,
    dateHeure: Date,
    duree: number,
    excludeCoursId?: number
  ): Promise<void> {
    // Vérifie qu'aucun cours ni reservation n'occupe déjà le terrain sur la plage horaire
    const start = dateHeure;
    const end = new Date(start.getTime() + duree * 60 * 1000);
    const dayStart = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    const coursMemeJour = await this.dbclient.cours.findMany({
      where: {
        terrainId,
        id: excludeCoursId ? { not: excludeCoursId } : undefined,
        dateHeure: {
          gte: dayStart,
          lt: dayEnd,
        },
      },
      select: {
        dateHeure: true,
        duree: true,
      },
    });

    const conflitCours = coursMemeJour.some((cours) => {
      const coursStart = cours.dateHeure;
      const coursEnd = new Date(coursStart.getTime() + cours.duree * 60 * 1000);
      return start < coursEnd && end > coursStart;
    });

    if (conflitCours) {
      throw new Error("Le terrain accueille déjà un autre cours sur ce créneau.");
    }

    const conflitReservation = await this.dbclient.reservation.findFirst({
      where: {
        terrainId,
        dateReservation: dayStart,
        statut: { not: "Annulée" },
        AND: [
          { heureDebut: { lt: end } },
          { heureFin: { gt: start } },
        ],
      },
    });

    if (conflitReservation) {
      throw new Error("Le terrain est réservé sur ce créneau.");
    }
  }

  private mapToCours = (record: {
    id: number;
    terrainId: number;
    titre: string;
    niveau: string;
    dateHeure: Date;
    duree: number;
    capacite: number;
  }): Cours => ({
    id: record.id,
    terrainId: record.terrainId,
    titre: record.titre,
    niveau: record.niveau,
    dateHeure: record.dateHeure,
    duree: record.duree,
    capacite: record.capacite,
  });
}
