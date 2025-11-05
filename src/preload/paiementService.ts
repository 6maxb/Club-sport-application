import Paiement from "src/shared/paiement";
import IPaiementService from "src/shared/interfaces/IPaiementService";
import { ipcRenderer } from "electron";

export function paiementService(): IPaiementService {
  // Simplifie les appels IPC pour ce module
  return {
    getAll: () => ipcRenderer.invoke("paiement:getAll"),
    getById: (id: number) => ipcRenderer.invoke("paiement:getById", id),
    getByAdhesion: (adhesionId: number) => ipcRenderer.invoke("paiement:getByAdhesion", adhesionId),
    getByReservation: (reservationId: number) =>
      ipcRenderer.invoke("paiement:getByReservation", reservationId),
    getByCours: (coursId: number) => ipcRenderer.invoke("paiement:getByCours", coursId),
    create: (data: Omit<Paiement, "id">) => ipcRenderer.invoke("paiement:create", data),
    delete: (id: number) => ipcRenderer.invoke("paiement:delete", id),
  };
}
