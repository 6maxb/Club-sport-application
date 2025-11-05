// Interface pour gérer les inscriptions aux cours
import Participe from "../participe";

export default interface IParticipationService {
  getParticipants(coursId: number): Promise<Participe[]>;
  getCoursInscrits(membreId: number): Promise<Participe[]>;
  inscrire(coursId: number, membreId: number): Promise<void>;
  desinscrire(coursId: number, membreId: number): Promise<void>;
  mettreAJourStatut(coursId: number, membreId: number, statut: string): Promise<void>;
}
