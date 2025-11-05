// Composable Vue pour centraliser les appels liés aux terrains
import { ref } from "vue";
import Terrain from "src/shared/terrain";

const terrains = ref<Terrain[]>([]);
const terrainsDisponibles = ref<Terrain[]>([]);

export function useTerrains() {
  const chargerTerrains = async () => {
    terrains.value = await window.electronService.terrains.getAll();
  };

  const chargerTerrainsDisponibles = async (date: Date, heureDebut: string, heureFin: string) => {
    terrainsDisponibles.value = await window.electronService.terrains.getDisponibles(date, heureDebut, heureFin);
  };

  const creerTerrain = async (data: Omit<Terrain, "id">) => {
    await window.electronService.terrains.create(data);
    await chargerTerrains();
  };

  const modifierTerrain = async (id: number, data: Partial<Omit<Terrain, "id">>) => {
    await window.electronService.terrains.update(id, data);
    await chargerTerrains();
  };

  const supprimerTerrain = async (id: number) => {
    await window.electronService.terrains.delete(id);
    await chargerTerrains();
  };

  return {
    terrains,
    terrainsDisponibles,
    chargerTerrains,
    chargerTerrainsDisponibles,
    creerTerrain,
    modifierTerrain,
    supprimerTerrain,
  };
}
