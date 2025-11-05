// Opérations disponibles sur les terrains
import Terrain from "../terrain";

export default interface ITerrainService {
  getAll(): Promise<Terrain[]>;
  getById(id: number): Promise<Terrain | null>;
  create(data: Omit<Terrain, "id">): Promise<Terrain>;
  update(id: number, data: Partial<Omit<Terrain, "id">>): Promise<Terrain>;
  delete(id: number): Promise<void>;
  getDisponibles(date: Date, heureDebut: string, heureFin: string): Promise<Terrain[]>;
}
