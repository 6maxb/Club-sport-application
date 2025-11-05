// Gère les accès Prisma pour l'entité Membre (filtrage actifs/entraîneurs inclus)
import { PrismaClient } from "./prisma/generated/client";
import { getPrismaClient } from "./prismaClient";
import Membre from "src/shared/membre";

export class MembreRepository {
  private dbclient: PrismaClient;

  constructor() {
    this.dbclient = getPrismaClient();
  }

  async getAll(): Promise<Membre[]> {
    const membres = await this.dbclient.membre.findMany();
    // Utilisation d'une fonction fléchée pour conserver le contexte `this` pendant le map
    return membres.map((record) => this.mapToMembre(record));
  }

  async getById(id: number): Promise<Membre | null> {
    const membre = await this.dbclient.membre.findUnique({ where: { id } });
    return membre ? this.mapToMembre(membre) : null;
  }

  async getActifs(): Promise<Membre[]> {
    // Retourne uniquement les membres marqués comme actifs
    const membres = await this.dbclient.membre.findMany({ where: { estActif: true } });
    // Préserve le contexte de la méthode de mapping
    return membres.map((record) => this.mapToMembre(record));
  }

  async getEntraineurs(): Promise<Membre[]> {
    // Sélection des membres qui peuvent animer un cours
    const membres = await this.dbclient.membre.findMany({ where: { estEntraineur: true } });
    // Même principe : on conserve `this` grâce à la fonction fléchée
    return membres.map((record) => this.mapToMembre(record));
  }

  async create(data: Omit<Membre, "id">): Promise<Membre> {
    const created = await this.dbclient.membre.create({
      data: {
        adresseId: data.adresseId,
        nom: data.nom,
        prenom: data.prenom,
        dateNaissance: data.dateNaissance,
        email: data.email,
        telephone: data.telephone,
        estEntraineur: data.estEntraineur,
        specialite: data.specialite,
        estActif: data.estActif,
      },
    });
    return this.mapToMembre(created);
  }

  async update(id: number, data: Partial<Omit<Membre, "id">>): Promise<Membre> {
    const updated = await this.dbclient.membre.update({
      where: { id },
      data: {
        adresseId: data.adresseId,
        nom: data.nom,
        prenom: data.prenom,
        dateNaissance: data.dateNaissance,
        email: data.email,
        telephone: data.telephone,
        estEntraineur: data.estEntraineur,
        specialite: data.specialite,
        estActif: data.estActif,
      },
    });
    return this.mapToMembre(updated);
  }

  async delete(id: number): Promise<void> {
    await this.dbclient.membre.delete({ where: { id } });
  }

  private mapToMembre = (record: {
    id: number;
    adresseId: number;
    nom: string;
    prenom: string;
    dateNaissance: Date;
    email: string;
    telephone: string | null;
    estEntraineur: boolean;
    specialite: string | null;
    estActif: boolean;
  }): Membre => ({
    id: record.id,
    adresseId: record.adresseId,
    nom: record.nom,
    prenom: record.prenom,
    dateNaissance: record.dateNaissance,
    email: record.email,
    telephone: record.telephone ?? undefined,
    estEntraineur: record.estEntraineur,
    specialite: record.specialite ?? undefined,
    estActif: record.estActif,
  });
}
