import Adhesion from "src/shared/adhesion";
import IAdhesionService from "src/shared/interfaces/IAdhesionService";
import { ipcRenderer } from "electron";

export function adhesionService(): IAdhesionService {
  // Simplifie les appels IPC pour ce module
  return {
    getAll: () => ipcRenderer.invoke("adhesion:getAll"),
    getById: (id: number) => ipcRenderer.invoke("adhesion:getById", id),
    getByMembre: (membreId: number) => ipcRenderer.invoke("adhesion:getByMembre", membreId),
    getActiveByMembre: (membreId: number) => ipcRenderer.invoke("adhesion:getActiveByMembre", membreId),
    create: (data: Omit<Adhesion, "id">) => ipcRenderer.invoke("adhesion:create", data),
    update: (id: number, data: Partial<Omit<Adhesion, "id">>) =>
      ipcRenderer.invoke("adhesion:update", id, data),
    delete: (id: number) => ipcRenderer.invoke("adhesion:delete", id),
  };
}
