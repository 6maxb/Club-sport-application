// Lie le repository correspondant aux canaux IPC
import { ipcMain } from "electron";
import Adresse from "src/shared/adresse";
import { AdresseRepository } from "./adresseRepository";

export function registerAdresseRepository() {
  const repository = new AdresseRepository();

  ipcMain.handle("adresse:getAll", () => repository.getAll());
  ipcMain.handle("adresse:getById", (_event, id: number) => repository.getById(id));
  ipcMain.handle("adresse:create", (_event, data: Omit<Adresse, "id">) => repository.create(data));
  ipcMain.handle("adresse:update", (_event, id: number, data: Partial<Omit<Adresse, "id">>) =>
    repository.update(id, data)
  );
  ipcMain.handle("adresse:delete", (_event, id: number) => repository.delete(id));
}
