// Contrat du service membres côté preload
import Membre from "../membre";

export default interface IMembreService {
  getAll(): Promise<Membre[]>;
  getById(id: number): Promise<Membre | null>;
  create(data: Omit<Membre, "id">): Promise<Membre>;
  update(id: number, data: Partial<Omit<Membre, "id">>): Promise<Membre>;
  delete(id: number): Promise<void>;
  getActifs(): Promise<Membre[]>;
  getEntraineurs(): Promise<Membre[]>;
}
