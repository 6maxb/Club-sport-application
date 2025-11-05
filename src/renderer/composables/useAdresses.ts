// Composable Vue pour centraliser les appels liés aux adresses
import { ref } from "vue";
import Adresse from "src/shared/adresse";

const adresses = ref<Adresse[]>([]);

export function useAdresses() {
  const chargerAdresses = async () => {
    adresses.value = await window.electronService.adresses.getAll();
  };

  const creerAdresse = async (data: Omit<Adresse, "id">) => {
    await window.electronService.adresses.create(data);
    await chargerAdresses();
  };

  const modifierAdresse = async (id: number, data: Partial<Omit<Adresse, "id">>) => {
    await window.electronService.adresses.update(id, data);
    await chargerAdresses();
  };

  const supprimerAdresse = async (id: number) => {
    await window.electronService.adresses.delete(id);
    await chargerAdresses();
  };

  return {
    adresses,
    chargerAdresses,
    creerAdresse,
    modifierAdresse,
    supprimerAdresse,
  };
}
