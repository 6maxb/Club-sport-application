import Cours from "src/shared/cours";
import ICoursService from "src/shared/interfaces/ICoursService";
import { ipcRenderer } from "electron";

export function coursService(): ICoursService {
  // Simplifie les appels IPC pour ce module
  return {
    getAll: () => ipcRenderer.invoke("cours:getAll"),
    getById: (id: number) => ipcRenderer.invoke("cours:getById", id),
    getByNiveau: (niveau: string) => ipcRenderer.invoke("cours:getByNiveau", niveau),
    create: (data: Omit<Cours, "id">) => ipcRenderer.invoke("cours:create", data),
    update: (id: number, data: Partial<Omit<Cours, "id">>) =>
      ipcRenderer.invoke("cours:update", id, data),
    delete: (id: number) => ipcRenderer.invoke("cours:delete", id),
    inscrireParticipant: (coursId: number, membreId: number) =>
      ipcRenderer.invoke("cours:inscrireParticipant", coursId, membreId),
    desinscrireParticipant: (coursId: number, membreId: number) =>
      ipcRenderer.invoke("cours:desinscrireParticipant", coursId, membreId),
    assignerEntraineur: (coursId: number, membreId: number, role?: string, remuneration?: number) =>
      ipcRenderer.invoke("cours:assignerEntraineur", coursId, membreId, role, remuneration),
    retirerEntraineur: (coursId: number, membreId: number) =>
      ipcRenderer.invoke("cours:retirerEntraineur", coursId, membreId),
  };
}
