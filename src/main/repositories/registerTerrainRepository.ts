// Lie le repository correspondant aux canaux IPC
import { ipcMain } from "electron";
import Terrain from "src/shared/terrain";
import { TerrainRepository } from "./terrainRepository";

export function registerTerrainRepository() {
  const repository = new TerrainRepository();

  ipcMain.handle("terrain:getAll", () => repository.getAll());
  ipcMain.handle("terrain:getById", (_event, id: number) => repository.getById(id));
  ipcMain.handle("terrain:create", (_event, data: Omit<Terrain, "id">) => repository.create(data));
  ipcMain.handle("terrain:update", (_event, id: number, data: Partial<Omit<Terrain, "id">>) =>
    repository.update(id, data)
  );
  ipcMain.handle("terrain:delete", (_event, id: number) => repository.delete(id));
  ipcMain.handle(
    "terrain:getDisponibles",
    (_event, date: string, heureDebut: string, heureFin: string) =>
      repository.getDisponibles(new Date(date), heureDebut, heureFin)
  );
}
