import Reservation from "src/shared/reservation";
import IReservationService from "src/shared/interfaces/IReservationService";
import { ipcRenderer } from "electron";

export function reservationService(): IReservationService {
  // Simplifie les appels IPC pour ce module
  return {
    getAll: () => ipcRenderer.invoke("reservation:getAll"),
    getById: (id: number) => ipcRenderer.invoke("reservation:getById", id),
    getByMembre: (membreId: number) => ipcRenderer.invoke("reservation:getByMembre", membreId),
    create: (data: Omit<Reservation, "id" | "dateCreation">) =>
      ipcRenderer.invoke("reservation:create", data),
    update: (id: number, data: Partial<Omit<Reservation, "id" | "dateCreation">>) =>
      ipcRenderer.invoke("reservation:update", id, data),
    cancel: (id: number) => ipcRenderer.invoke("reservation:cancel", id),
    delete: (id: number) => ipcRenderer.invoke("reservation:delete", id),
    checkDisponibilite: (
      terrainId: number,
      date: Date,
      heureDebut: string,
      heureFin: string,
      excludeId?: number
    ) =>
      ipcRenderer.invoke(
        "reservation:checkDisponibilite",
        terrainId,
        date.toISOString(),
        heureDebut,
        heureFin,
        excludeId
      ),
  };
}
