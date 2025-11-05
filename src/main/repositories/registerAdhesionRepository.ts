// Lie le repository correspondant aux canaux IPC
import { ipcMain } from "electron";
import Adhesion from "src/shared/adhesion";
import { AdhesionRepository } from "./adhesionRepository";

export function registerAdhesionRepository() {
  const repository = new AdhesionRepository();

  ipcMain.handle("adhesion:getAll", () => repository.getAll());
  ipcMain.handle("adhesion:getById", (_event, id: number) => repository.getById(id));
  ipcMain.handle("adhesion:getByMembre", (_event, membreId: number) => repository.getByMembre(membreId));
  ipcMain.handle("adhesion:getActiveByMembre", (_event, membreId: number) => repository.getActiveByMembre(membreId));
  ipcMain.handle("adhesion:create", (_event, data: Omit<Adhesion, "id">) => repository.create(data));
  ipcMain.handle(
    "adhesion:update",
    (_event, id: number, data: Partial<Omit<Adhesion, "id">>) => repository.update(id, data)
  );
  ipcMain.handle("adhesion:delete", (_event, id: number) => repository.delete(id));
}
