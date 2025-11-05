// Contrat exposé côté preload pour manipuler les adresses
import Adresse from "../adresse";

export default interface IAdresseService {
  getAll(): Promise<Adresse[]>;
  getById(id: number): Promise<Adresse | null>;
  create(data: Omit<Adresse, "id">): Promise<Adresse>;
  update(id: number, data: Partial<Omit<Adresse, "id">>): Promise<Adresse>;
  delete(id: number): Promise<void>;
}
