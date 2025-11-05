// Composable Vue pour centraliser les appels liés aux reservations
import { ref } from "vue";
import Reservation from "src/shared/reservation";

const reservations = ref<Reservation[]>([]);
const reservationsParMembre = ref<Reservation[]>([]);

export function useReservations() {
  const chargerReservations = async () => {
    reservations.value = await window.electronService.reservations.getAll();
  };

  const chargerParMembre = async (membreId: number) => {
    reservationsParMembre.value = await window.electronService.reservations.getByMembre(membreId);
  };

  const creerReservation = async (data: Omit<Reservation, "id" | "dateCreation">) => {
    await window.electronService.reservations.create(data);
    await chargerReservations();
  };

  const modifierReservation = async (id: number, data: Partial<Omit<Reservation, "id" | "dateCreation">>) => {
    await window.electronService.reservations.update(id, data);
    await chargerReservations();
  };

  const annulerReservation = async (id: number) => {
    await window.electronService.reservations.cancel(id);
    await chargerReservations();
  };

  const supprimerReservation = async (id: number) => {
    await window.electronService.reservations.delete(id);
    await chargerReservations();
  };

  const verifierDisponibilite = async (
    terrainId: number,
    date: Date,
    heureDebut: string,
    heureFin: string,
    excludeId?: number,
  ) => {
    return window.electronService.reservations.checkDisponibilite(
      terrainId,
      date,
      heureDebut,
      heureFin,
      excludeId,
    );
  };

  return {
    reservations,
    reservationsParMembre,
    chargerReservations,
    chargerParMembre,
    creerReservation,
    modifierReservation,
    annulerReservation,
    supprimerReservation,
    verifierDisponibilite,
  };
}
