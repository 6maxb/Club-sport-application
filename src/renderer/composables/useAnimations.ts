// Composable Vue pour centraliser les appels liés aux animations
import { ref } from "vue";
import Anime from "src/shared/anime";

const animateurs = ref<Anime[]>([]);
const coursAnimes = ref<Anime[]>([]);

export function useAnimations() {
  const chargerAnimateurs = async (coursId: number) => {
    animateurs.value = await window.electronService.animations.getAnimateurs(coursId);
  };

  const chargerCoursAnimes = async (membreId: number) => {
    coursAnimes.value = await window.electronService.animations.getCoursAnimes(membreId);
  };

  const assigner = async (coursId: number, membreId: number, role?: string, remuneration?: number) => {
    await window.electronService.animations.assigner(coursId, membreId, role, remuneration);
    await chargerAnimateurs(coursId);
  };

  const retirer = async (coursId: number, membreId: number) => {
    await window.electronService.animations.retirer(coursId, membreId);
    await chargerAnimateurs(coursId);
  };

  const mettreAJourRole = async (coursId: number, membreId: number, role: string) => {
    await window.electronService.animations.mettreAJourRole(coursId, membreId, role);
    await chargerAnimateurs(coursId);
  };

  const mettreAJourRemuneration = async (coursId: number, membreId: number, remuneration: number) => {
    await window.electronService.animations.mettreAJourRemuneration(coursId, membreId, remuneration);
    await chargerAnimateurs(coursId);
  };

  return {
    animateurs,
    coursAnimes,
    chargerAnimateurs,
    chargerCoursAnimes,
    assigner,
    retirer,
    mettreAJourRole,
    mettreAJourRemuneration,
  };
}
