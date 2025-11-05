import IAnimationService from "src/shared/interfaces/IAnimationService";
import { ipcRenderer } from "electron";

export function animationService(): IAnimationService {
  // Simplifie les appels IPC pour ce module
  return {
    getAnimateurs: (coursId: number) => ipcRenderer.invoke("animation:getAnimateurs", coursId),
    getCoursAnimes: (membreId: number) => ipcRenderer.invoke("animation:getCoursAnimes", membreId),
    assigner: (coursId: number, membreId: number, role?: string, remuneration?: number) =>
      ipcRenderer.invoke("animation:assigner", coursId, membreId, role, remuneration),
    retirer: (coursId: number, membreId: number) => ipcRenderer.invoke("animation:retirer", coursId, membreId),
    mettreAJourRole: (coursId: number, membreId: number, role: string) =>
      ipcRenderer.invoke("animation:mettreAJourRole", coursId, membreId, role),
    mettreAJourRemuneration: (coursId: number, membreId: number, remuneration: number) =>
      ipcRenderer.invoke("animation:mettreAJourRemuneration", coursId, membreId, remuneration),
  };
}
