// Lie le repository correspondant aux canaux IPC
import { ipcMain } from "electron";
import { ParticipationRepository } from "./participationRepository";

export function registerParticipationRepository() {
  const repository = new ParticipationRepository();

  ipcMain.handle("participation:getParticipants", (_event, coursId: number) =>
    repository.getParticipants(coursId)
  );
  ipcMain.handle("participation:getCoursInscrits", (_event, membreId: number) =>
    repository.getCoursInscrits(membreId)
  );
  ipcMain.handle("participation:inscrire", (_event, coursId: number, membreId: number) =>
    repository.inscrire(coursId, membreId)
  );
  ipcMain.handle("participation:desinscrire", (_event, coursId: number, membreId: number) =>
    repository.desinscrire(coursId, membreId)
  );
  ipcMain.handle("participation:mettreAJourStatut", (_event, coursId: number, membreId: number, statut: string) =>
    repository.mettreAJourStatut(coursId, membreId, statut)
  );
}
