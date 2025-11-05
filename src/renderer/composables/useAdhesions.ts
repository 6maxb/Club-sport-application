// Composable Vue pour centraliser les appels liés aux adhesions
import { ref } from "vue";
import Adhesion from "src/shared/adhesion";

const adhesions = ref<Adhesion[]>([]);
const adhesionsParMembre = ref<Adhesion[]>([]);
const adhesionActive = ref<Adhesion | null>(null);

export function useAdhesions() {
  const chargerToutesAdhesions = async () => {
    adhesions.value = await window.electronService.adhesions.getAll();
  };

  const chargerParMembre = async (membreId: number) => {
    adhesionsParMembre.value = await window.electronService.adhesions.getByMembre(membreId);
  };

  const chargerActiveParMembre = async (membreId: number) => {
    adhesionActive.value = await window.electronService.adhesions.getActiveByMembre(membreId);
  };

  const creerAdhesion = async (data: Omit<Adhesion, "id">) => {
    await window.electronService.adhesions.create(data);
    await chargerToutesAdhesions();
  };

  const modifierAdhesion = async (id: number, data: Partial<Omit<Adhesion, "id">>) => {
    await window.electronService.adhesions.update(id, data);
    await chargerToutesAdhesions();
  };

  const supprimerAdhesion = async (id: number) => {
    await window.electronService.adhesions.delete(id);
    await chargerToutesAdhesions();
  };

  return {
    adhesions,
    adhesionsParMembre,
    adhesionActive,
    chargerToutesAdhesions,
    chargerParMembre,
    chargerActiveParMembre,
    creerAdhesion,
    modifierAdhesion,
    supprimerAdhesion,
  };
}
