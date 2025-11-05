// Composable Vue pour centraliser les appels liés aux paiements
import { ref } from "vue";
import Paiement from "src/shared/paiement";

const paiements = ref<Paiement[]>([]);
const paiementsAdhesion = ref<Paiement[]>([]);
const paiementsReservation = ref<Paiement[]>([]);
const paiementsCours = ref<Paiement[]>([]);

export function usePaiements() {
  const chargerTousPaiements = async () => {
    paiements.value = await window.electronService.paiements.getAll();
  };

  const chargerParAdhesion = async (adhesionId: number) => {
    paiementsAdhesion.value = await window.electronService.paiements.getByAdhesion(adhesionId);
  };

  const chargerParReservation = async (reservationId: number) => {
    paiementsReservation.value = await window.electronService.paiements.getByReservation(reservationId);
  };

  const chargerParCours = async (coursId: number) => {
    paiementsCours.value = await window.electronService.paiements.getByCours(coursId);
  };

  const enregistrerPaiement = async (data: Omit<Paiement, "id">) => {
    await window.electronService.paiements.create(data);
    await chargerTousPaiements();
  };

  const supprimerPaiement = async (id: number) => {
    await window.electronService.paiements.delete(id);
    await chargerTousPaiements();
  };

  return {
    paiements,
    paiementsAdhesion,
    paiementsReservation,
    paiementsCours,
    chargerTousPaiements,
    chargerParAdhesion,
    chargerParReservation,
    chargerParCours,
    enregistrerPaiement,
    supprimerPaiement,
  };
}
