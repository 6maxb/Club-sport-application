// Interface des méthodes utilisées pour les réservations
import Reservation from "../reservation";

export default interface IReservationService {
  getAll(): Promise<Reservation[]>;
  getById(id: number): Promise<Reservation | null>;
  getByMembre(membreId: number): Promise<Reservation[]>;
  create(data: Omit<Reservation, "id" | "dateCreation">): Promise<Reservation>;
  update(id: number, data: Partial<Omit<Reservation, "id" | "dateCreation">>): Promise<Reservation>;
  cancel(id: number): Promise<void>;
  delete(id: number): Promise<void>;
  checkDisponibilite(
    terrainId: number,
    date: Date,
    heureDebut: string,
    heureFin: string,
    excludeId?: number
  ): Promise<boolean>;
}
