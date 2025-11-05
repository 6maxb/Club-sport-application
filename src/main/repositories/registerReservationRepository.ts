// Lie le repository correspondant aux canaux IPC
import { ipcMain } from "electron";
import Reservation from "src/shared/reservation";
import { ReservationRepository } from "./reservationRepository";

export function registerReservationRepository() {
  const repository = new ReservationRepository();

  ipcMain.handle("reservation:getAll", () => repository.getAll());
  ipcMain.handle("reservation:getById", (_event, id: number) => repository.getById(id));
  ipcMain.handle("reservation:getByMembre", (_event, membreId: number) => repository.getByMembre(membreId));
  ipcMain.handle("reservation:create", (_event, data: Omit<Reservation, "id" | "dateCreation">) => repository.create(data));
  ipcMain.handle(
    "reservation:update",
    (_event, id: number, data: Partial<Omit<Reservation, "id" | "dateCreation">>) => repository.update(id, data)
  );
  ipcMain.handle("reservation:cancel", (_event, id: number) => repository.cancel(id));
  ipcMain.handle("reservation:delete", (_event, id: number) => repository.delete(id));
  ipcMain.handle(
    "reservation:checkDisponibilite",
    (_event, terrainId: number, date: string, heureDebut: string, heureFin: string, excludeId?: number) =>
      repository.checkDisponibilite(terrainId, new Date(date), heureDebut, heureFin, excludeId)
  );
}
