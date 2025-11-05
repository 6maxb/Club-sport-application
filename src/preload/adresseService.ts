import Adresse from "src/shared/adresse";
import IAdresseService from "src/shared/interfaces/IAdresseService";
import { ipcRenderer } from "electron";

export function adresseService(): IAdresseService {
  // Chaque méthode enveloppe un handler IPC défini côté main
  return {
    getAll: () => ipcRenderer.invoke("adresse:getAll"),
    getById: (id: number) => ipcRenderer.invoke("adresse:getById", id),
    create: (data: Omit<Adresse, "id">) => ipcRenderer.invoke("adresse:create", data),
    update: (id: number, data: Partial<Omit<Adresse, "id">>) =>
      ipcRenderer.invoke("adresse:update", id, data),
    delete: (id: number) => ipcRenderer.invoke("adresse:delete", id),
  };
}
