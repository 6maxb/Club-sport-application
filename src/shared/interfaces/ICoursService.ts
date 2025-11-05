// Interface du service côté renderer pour les cours
import Cours from "../cours";

export default interface ICoursService {
  getAll(): Promise<Cours[]>;
  getById(id: number): Promise<Cours | null>;
  getByNiveau(niveau: string): Promise<Cours[]>;
  create(data: Omit<Cours, "id">): Promise<Cours>;
  update(id: number, data: Partial<Omit<Cours, "id">>): Promise<Cours>;
  delete(id: number): Promise<void>;
  inscrireParticipant(coursId: number, membreId: number): Promise<void>;
  desinscrireParticipant(coursId: number, membreId: number): Promise<void>;
  assignerEntraineur(coursId: number, membreId: number, role?: string, remuneration?: number): Promise<void>;
  retirerEntraineur(coursId: number, membreId: number): Promise<void>;
}
