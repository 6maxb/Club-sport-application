// Expose tous les services autorisés côté renderer via le bridge Electron
import { contextBridge } from "electron";
import IElectronService from "src/shared/interfaces/IElectronService";
import { adresseService } from "./adresseService";
import { membreService } from "./membreService";
import { terrainService } from "./terrainService";
import { adhesionService } from "./adhesionService";
import { reservationService } from "./reservationService";
import { coursService } from "./coursService";
import { paiementService } from "./paiementService";
import { participationService } from "./participationService";
import { animationService } from "./animationService";

contextBridge.exposeInMainWorld(
  "electronService",
  {
    adresses: adresseService(),
    membres: membreService(),
    terrains: terrainService(),
    adhesions: adhesionService(),
    reservations: reservationService(),
    cours: coursService(),
    paiements: paiementService(),
    participations: participationService(),
    animations: animationService(),
  } as IElectronService,
);
