// Lie le repository correspondant aux canaux IPC
import { ipcMain } from "electron";
import Cours from "src/shared/cours";
import { CoursRepository } from "./coursRepository";

export function registerCoursRepository() {
  const repository = new CoursRepository();

  ipcMain.handle("cours:getAll", () => repository.getAll());
  ipcMain.handle("cours:getById", (_event, id: number) => repository.getById(id));
  ipcMain.handle("cours:getByNiveau", (_event, niveau: string) => repository.getByNiveau(niveau));
  ipcMain.handle("cours:create", (_event, data: Omit<Cours, "id">) => repository.create(data));
  ipcMain.handle(
    "cours:update",
    (_event, id: number, data: Partial<Omit<Cours, "id">>) => repository.update(id, data)
  );
  ipcMain.handle("cours:delete", (_event, id: number) => repository.delete(id));
  ipcMain.handle("cours:inscrireParticipant", (_event, coursId: number, membreId: number) =>
    repository.inscrireParticipant(coursId, membreId)
  );
  ipcMain.handle("cours:desinscrireParticipant", (_event, coursId: number, membreId: number) =>
    repository.desinscrireParticipant(coursId, membreId)
  );
  ipcMain.handle(
    "cours:assignerEntraineur",
    (_event, coursId: number, membreId: number, role?: string, remuneration?: number) =>
      repository.assignerEntraineur(coursId, membreId, role, remuneration)
  );
  ipcMain.handle("cours:retirerEntraineur", (_event, coursId: number, membreId: number) =>
    repository.retirerEntraineur(coursId, membreId)
  );
}
