// Structure de l'objet injecté dans window.electronService
import IAdresseService from "./IAdresseService";
import IMembreService from "./IMembreService";
import ITerrainService from "./ITerrainService";
import IAdhesionService from "./IAdhesionService";
import IReservationService from "./IReservationService";
import ICoursService from "./ICoursService";
import IPaiementService from "./IPaiementService";
import IParticipationService from "./IParticipationService";
import IAnimationService from "./IAnimationService";

export default interface IElectronService {
  adresses: IAdresseService;
  membres: IMembreService;
  terrains: ITerrainService;
  adhesions: IAdhesionService;
  reservations: IReservationService;
  cours: ICoursService;
  paiements: IPaiementService;
  participations: IParticipationService;
  animations: IAnimationService;
}

declare global {
  interface Window {
    electronService: IElectronService;
  }
}
