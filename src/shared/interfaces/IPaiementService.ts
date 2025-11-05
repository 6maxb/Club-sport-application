// Contrat pour manipuler les paiements
import Paiement from "../paiement";

export default interface IPaiementService {
  getAll(): Promise<Paiement[]>;
  getById(id: number): Promise<Paiement | null>;
  getByAdhesion(adhesionId: number): Promise<Paiement[]>;
  getByReservation(reservationId: number): Promise<Paiement[]>;
  getByCours(coursId: number): Promise<Paiement[]>;
  create(data: Omit<Paiement, "id">): Promise<Paiement>;
  delete(id: number): Promise<void>;
}
