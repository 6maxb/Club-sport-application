// Regroupe l'enregistrement de l'ensemble des handlers IPC côté main
import { registerAdresseRepository } from "./repositories/registerAdresseRepository";
import { registerAdhesionRepository } from "./repositories/registerAdhesionRepository";
import { registerCoursRepository } from "./repositories/registerCoursRepository";
import { registerMembreRepository } from "./repositories/registerMembreRepository";
import { registerReservationRepository } from "./repositories/registerReservationRepository";
import { registerTerrainRepository } from "./repositories/registerTerrainRepository";
import { registerPaiementRepository } from "./repositories/registerPaiementRepository";
import { registerParticipationRepository } from "./repositories/registerParticipationRepository";
import { registerAnimationRepository } from "./repositories/registerAnimationRepository";


export function registerRepositories() {
  // Chaque repository expose ses handlers IPC pour être utilisé côté renderer
  registerAdresseRepository();
  registerAdhesionRepository();
  registerCoursRepository();
  registerMembreRepository();
  registerTerrainRepository();
  registerReservationRepository();
  registerPaiementRepository();
  registerParticipationRepository();
  registerAnimationRepository();
}
