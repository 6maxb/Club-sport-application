// Contrat dédié à la gestion des animateurs de cours
import Anime from "../anime";

export default interface IAnimationService {
  getAnimateurs(coursId: number): Promise<Anime[]>;
  getCoursAnimes(membreId: number): Promise<Anime[]>;
  assigner(coursId: number, membreId: number, role?: string, remuneration?: number): Promise<void>;
  retirer(coursId: number, membreId: number): Promise<void>;
  mettreAJourRole(coursId: number, membreId: number, role: string): Promise<void>;
  mettreAJourRemuneration(coursId: number, membreId: number, remuneration: number): Promise<void>;
}
