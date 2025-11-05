import Membre from "src/shared/membre";
import IMembreService from "src/shared/interfaces/IMembreService";
import { ipcRenderer } from "electron";

export function membreService(): IMembreService {
  // Fournit au renderer l'accès aux handlers du module membre
  return {
    getAll: () => ipcRenderer.invoke("membre:getAll"),
    getById: (id: number) => ipcRenderer.invoke("membre:getById", id),
    create: (data: Omit<Membre, "id">) => ipcRenderer.invoke("membre:create", data),
    update: (id: number, data: Partial<Omit<Membre, "id">>) =>
      ipcRenderer.invoke("membre:update", id, data),
    delete: (id: number) => ipcRenderer.invoke("membre:delete", id),
    getActifs: () => ipcRenderer.invoke("membre:getActifs"),
    getEntraineurs: () => ipcRenderer.invoke("membre:getEntraineurs"),
  };
}
