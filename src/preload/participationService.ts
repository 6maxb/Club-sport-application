import IParticipationService from "src/shared/interfaces/IParticipationService";
import { ipcRenderer } from "electron";

export function participationService(): IParticipationService {
  // Simplifie les appels IPC pour ce module
  return {
    getParticipants: (coursId: number) => ipcRenderer.invoke("participation:getParticipants", coursId),
    getCoursInscrits: (membreId: number) => ipcRenderer.invoke("participation:getCoursInscrits", membreId),
    inscrire: (coursId: number, membreId: number) => ipcRenderer.invoke("participation:inscrire", coursId, membreId),
    desinscrire: (coursId: number, membreId: number) =>
      ipcRenderer.invoke("participation:desinscrire", coursId, membreId),
    mettreAJourStatut: (coursId: number, membreId: number, statut: string) =>
      ipcRenderer.invoke("participation:mettreAJourStatut", coursId, membreId, statut),
  };
}
