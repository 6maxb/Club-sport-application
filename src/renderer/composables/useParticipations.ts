// Composable Vue pour centraliser les appels liés aux participations
import { ref } from "vue";
import Participe from "src/shared/participe";

const participants = ref<Participe[]>([]);
const coursInscrits = ref<Participe[]>([]);

export function useParticipations() {
  const chargerParticipants = async (coursId: number) => {
    participants.value = await window.electronService.participations.getParticipants(coursId);
  };

  const chargerCoursInscrits = async (membreId: number) => {
    coursInscrits.value = await window.electronService.participations.getCoursInscrits(membreId);
  };

  const inscrire = async (coursId: number, membreId: number) => {
    await window.electronService.participations.inscrire(coursId, membreId);
    await chargerParticipants(coursId);
  };

  const desinscrire = async (coursId: number, membreId: number) => {
    await window.electronService.participations.desinscrire(coursId, membreId);
    await chargerParticipants(coursId);
  };

  const mettreAJourStatut = async (coursId: number, membreId: number, statut: string) => {
    await window.electronService.participations.mettreAJourStatut(coursId, membreId, statut);
    await chargerParticipants(coursId);
  };

  return {
    participants,
    coursInscrits,
    chargerParticipants,
    chargerCoursInscrits,
    inscrire,
    desinscrire,
    mettreAJourStatut,
  };
}
