// Composable Vue pour centraliser les appels liés aux cours
import { ref } from "vue";
import Cours from "src/shared/cours";

const cours = ref<Cours[]>([]);
const coursParNiveau = ref<Cours[]>([]);

export function useCours() {
  const chargerCours = async () => {
    cours.value = await window.electronService.cours.getAll();
  };

  const chargerCoursParNiveau = async (niveau: string) => {
    coursParNiveau.value = await window.electronService.cours.getByNiveau(niveau);
  };

  const creerCours = async (data: Omit<Cours, "id">) => {
    const created = await window.electronService.cours.create(data);
    await chargerCours();
    return created;
  };

  const modifierCours = async (id: number, data: Partial<Omit<Cours, "id">>) => {
    const updated = await window.electronService.cours.update(id, data);
    await chargerCours();
    return updated;
  };

  const supprimerCours = async (id: number) => {
    await window.electronService.cours.delete(id);
    await chargerCours();
  };

  const inscrireParticipant = async (coursId: number, membreId: number) => {
    await window.electronService.cours.inscrireParticipant(coursId, membreId);
    await chargerCours();
  };

  const desinscrireParticipant = async (coursId: number, membreId: number) => {
    await window.electronService.cours.desinscrireParticipant(coursId, membreId);
    await chargerCours();
  };

  const assignerEntraineur = async (coursId: number, membreId: number, role?: string, remuneration?: number) => {
    await window.electronService.cours.assignerEntraineur(coursId, membreId, role, remuneration);
    await chargerCours();
  };

  const retirerEntraineur = async (coursId: number, membreId: number) => {
    await window.electronService.cours.retirerEntraineur(coursId, membreId);
    await chargerCours();
  };

  return {
    cours,
    coursParNiveau,
    chargerCours,
    chargerCoursParNiveau,
    creerCours,
    modifierCours,
    supprimerCours,
    inscrireParticipant,
    desinscrireParticipant,
    assignerEntraineur,
    retirerEntraineur,
  };
}
