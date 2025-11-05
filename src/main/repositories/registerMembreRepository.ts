// Lie le repository correspondant aux canaux IPC
import { ipcMain } from "electron";
import Membre from "src/shared/membre";
import { MembreRepository } from "./membreRepository";

export function registerMembreRepository() {
  const repository = new MembreRepository();

  ipcMain.handle("membre:getAll", () => repository.getAll());
  ipcMain.handle("membre:getById", (_event, id: number) => repository.getById(id));
  ipcMain.handle("membre:getActifs", () => repository.getActifs());
  ipcMain.handle("membre:getEntraineurs", () => repository.getEntraineurs());
  ipcMain.handle("membre:create", (_event, data: Omit<Membre, "id">) => repository.create(data));
  ipcMain.handle(
    "membre:update",
    (_event, id: number, data: Partial<Omit<Membre, "id">>) => repository.update(id, data)
  );
  ipcMain.handle("membre:delete", (_event, id: number) => repository.delete(id));
}
