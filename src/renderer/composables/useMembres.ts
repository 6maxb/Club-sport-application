// Composable Vue pour centraliser les appels liés aux membres
import { ref } from "vue";
import Membre from "src/shared/membre";

const membres = ref<Membre[]>([]);
const membresActifs = ref<Membre[]>([]);
const entraineurs = ref<Membre[]>([]);

export function useMembres() {
  const chargerMembres = async () => {
    membres.value = await window.electronService.membres.getAll();
  };

  const chargerMembresActifs = async () => {
    membresActifs.value = await window.electronService.membres.getActifs();
  };

  const chargerEntraineurs = async () => {
    entraineurs.value = await window.electronService.membres.getEntraineurs();
  };

  const creerMembre = async (data: Omit<Membre, "id">) => {
    await window.electronService.membres.create(data);
    await chargerMembres();
  };

  const modifierMembre = async (id: number, data: Partial<Omit<Membre, "id">>) => {
    await window.electronService.membres.update(id, data);
    await chargerMembres();
  };

  const supprimerMembre = async (id: number) => {
    await window.electronService.membres.delete(id);
    await chargerMembres();
  };

  return {
    membres,
    membresActifs,
    entraineurs,
    chargerMembres,
    chargerMembresActifs,
    chargerEntraineurs,
    creerMembre,
    modifierMembre,
    supprimerMembre,
  };
}
