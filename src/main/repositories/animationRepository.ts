import { PrismaClient } from "@prisma/client";
import { getPrismaClient } from "./prismaClient";
import Anime from "src/shared/anime";

// Encapsule la gestion des animateurs (assignation, mise à jour, retrait)
export class AnimationRepository {
  private dbclient: PrismaClient;

  constructor() {
    this.dbclient = getPrismaClient();
  }

  async getAnimateurs(coursId: number): Promise<Anime[]> {
    const animateurs = await this.dbclient.anime.findMany({
      where: { coursId },
      include: { membre: true },
    });
    return animateurs.map((record) => this.mapToAnime(record));
  }

  async getCoursAnimes(membreId: number): Promise<Anime[]> {
    const cours = await this.dbclient.anime.findMany({
      where: { membreId },
      include: { cours: true },
    });
    return cours.map((record) => this.mapToAnime(record));
  }

  async assigner(coursId: number, membreId: number, role = "Principal", remuneration?: number): Promise<void> {
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

  async retirer(coursId: number, membreId: number): Promise<void> {
    await this.dbclient.anime.delete({
      where: {
        membreId_coursId: {
          membreId,
          coursId,
        },
      },
    });
  }

  async mettreAJourRole(coursId: number, membreId: number, role: string): Promise<void> {
    await this.dbclient.anime.update({
      where: {
        membreId_coursId: {
          membreId,
          coursId,
        },
      },
      data: { role },
    });
  }

  async mettreAJourRemuneration(coursId: number, membreId: number, remuneration: number): Promise<void> {
    await this.dbclient.anime.update({
      where: {
        membreId_coursId: {
          membreId,
          coursId,
        },
      },
      data: { remuneration },
    });
  }

  private mapToAnime = (record: {
    membreId: number;
    coursId: number;
    role: string;
    remuneration: any;
  }): Anime => ({
    membreId: record.membreId,
    coursId: record.coursId,
    role: record.role,
    remuneration: record.remuneration !== null ? Number(record.remuneration) : undefined,
  });
}
