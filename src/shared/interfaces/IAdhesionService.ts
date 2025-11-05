// Interface des opérations disponibles sur les adhésions
import Adhesion from "../adhesion";

export default interface IAdhesionService {
  getAll(): Promise<Adhesion[]>;
  getById(id: number): Promise<Adhesion | null>;
  getByMembre(membreId: number): Promise<Adhesion[]>;
  getActiveByMembre(membreId: number): Promise<Adhesion | null>;
  create(data: Omit<Adhesion, "id">): Promise<Adhesion>;
  update(id: number, data: Partial<Omit<Adhesion, "id">>): Promise<Adhesion>;
  delete(id: number): Promise<void>;
}
