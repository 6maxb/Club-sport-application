import Terrain from "src/shared/terrain";
import ITerrainService from "src/shared/interfaces/ITerrainService";
import { ipcRenderer } from "electron";

export function terrainService(): ITerrainService {
  // Simplifie les appels IPC pour les terrains depuis Vue
  return {
    getAll: () => ipcRenderer.invoke("terrain:getAll"),
    getById: (id: number) => ipcRenderer.invoke("terrain:getById", id),
    create: (data: Omit<Terrain, "id">) => ipcRenderer.invoke("terrain:create", data),
    update: (id: number, data: Partial<Omit<Terrain, "id">>) =>
      ipcRenderer.invoke("terrain:update", id, data),
    delete: (id: number) => ipcRenderer.invoke("terrain:delete", id),
    getDisponibles: (date: Date, heureDebut: string, heureFin: string) =>
      ipcRenderer.invoke("terrain:getDisponibles", date.toISOString(), heureDebut, heureFin),
  };
}
