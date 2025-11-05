// Lie le repository correspondant aux canaux IPC
import { ipcMain } from "electron";
import Paiement from "src/shared/paiement";
import { PaiementRepository } from "./paiementRepository";

export function registerPaiementRepository() {
  const repository = new PaiementRepository();

  ipcMain.handle("paiement:getAll", () => repository.getAll());
  ipcMain.handle("paiement:getById", (_event, id: number) => repository.getById(id));
  ipcMain.handle("paiement:getByAdhesion", (_event, adhesionId: number) => repository.getByAdhesion(adhesionId));
  ipcMain.handle("paiement:getByReservation", (_event, reservationId: number) =>
    repository.getByReservation(reservationId)
  );
  ipcMain.handle("paiement:getByCours", (_event, coursId: number) => repository.getByCours(coursId));
  ipcMain.handle("paiement:create", (_event, data: Omit<Paiement, "id">) => repository.create(data));
  ipcMain.handle("paiement:delete", (_event, id: number) => repository.delete(id));
}
