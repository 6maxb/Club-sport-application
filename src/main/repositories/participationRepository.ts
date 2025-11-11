import { PrismaClient } from "@prisma/client";
import { getPrismaClient } from "./prismaClient";
import Participe from "src/shared/participe";

// Traite les inscriptions des membres aux cours (ajout, suivi et retrait)
export class ParticipationRepository {
  private dbclient: PrismaClient;

  constructor() {
    this.dbclient = getPrismaClient();
  }

  async getParticipants(coursId: number): Promise<Participe[]> {
    const participations = await this.dbclient.participe.findMany({
      where: { coursId },
      include: { membre: true },
      orderBy: { dateInscription: "asc" },
    });
    // Conserver le contexte `this` lorsqu'on mappe
    return participations.map((record) => this.mapToParticipe(record));
  }

  async getCoursInscrits(membreId: number): Promise<Participe[]> {
    const participations = await this.dbclient.participe.findMany({
      where: { membreId },
      include: { cours: true },
      orderBy: { dateInscription: "desc" },
    });
    return participations.map((record) => this.mapToParticipe(record));
  }

  async inscrire(coursId: number, membreId: number): Promise<void> {
    const cours = await this.dbclient.cours.findUnique({ where: { id: coursId } });
    if (!cours) {
      throw new Error("Cours introuvable");
    }

    const count = await this.dbclient.participe.count({ where: { coursId } });
    if (count >= cours.capacite) {
      throw new Error("Capacité maximale atteinte pour ce cours.");
    }

    await this.dbclient.participe.create({
      data: {
        coursId,
        membreId,
        statut: "Inscrit",
      },
    });
  }

  async desinscrire(coursId: number, membreId: number): Promise<void> {
    await this.dbclient.participe.delete({
      where: {
        membreId_coursId: {
          membreId,
          coursId,
        },
      },
    });
  }

  async mettreAJourStatut(coursId: number, membreId: number, statut: string): Promise<void> {
    await this.dbclient.participe.update({
      where: {
        membreId_coursId: {
          membreId,
          coursId,
        },
      },
      data: {
        statut,
      },
    });
  }

  private mapToParticipe = (record: {
    membreId: number;
    coursId: number;
    statut: string;
    dateInscription: Date;
  }): Participe => ({
    membreId: record.membreId,
    coursId: record.coursId,
    statut: record.statut,
    dateInscription: record.dateInscription,
  });
}
