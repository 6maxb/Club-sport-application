// Lie le repository correspondant aux canaux IPC
import { ipcMain } from "electron";
import { AnimationRepository } from "./animationRepository";

export function registerAnimationRepository() {
  const repository = new AnimationRepository();

  ipcMain.handle("animation:getAnimateurs", (_event, coursId: number) => repository.getAnimateurs(coursId));
  ipcMain.handle("animation:getCoursAnimes", (_event, membreId: number) => repository.getCoursAnimes(membreId));
  ipcMain.handle(
    "animation:assigner",
    (_event, coursId: number, membreId: number, role?: string, remuneration?: number) =>
      repository.assigner(coursId, membreId, role, remuneration)
  );
  ipcMain.handle("animation:retirer", (_event, coursId: number, membreId: number) => repository.retirer(coursId, membreId));
  ipcMain.handle(
    "animation:mettreAJourRole",
    (_event, coursId: number, membreId: number, role: string) => repository.mettreAJourRole(coursId, membreId, role)
  );
  ipcMain.handle(
    "animation:mettreAJourRemuneration",
    (_event, coursId: number, membreId: number, remuneration: number) =>
      repository.mettreAJourRemuneration(coursId, membreId, remuneration)
  );
}
