<!-- Page Terrains : affiche et gère les données terrains -->
<template>
  <div class="page">
    <header class="page__header">
      <h1>Terrains</h1>
      <button @click="ouvrirDialog">Ajouter un terrain</button>
    </header>

    <section class="page__content">
      <table class="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Surface</th>
            <th>Couvert</th>
            <th>Éclairage</th>
            <th>Localisation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="terrain in terrains" :key="terrain.id">
            <td>{{ terrain.nom }}</td>
            <td>{{ terrain.surface ?? "-" }}</td>
            <td>{{ terrain.couvert ? "Oui" : "Non" }}</td>
            <td>{{ terrain.eclairage ? "Oui" : "Non" }}</td>
            <td>{{ terrain.localisation ?? "-" }}</td>
            <td>
              <button @click="editerTerrain(terrain)">Modifier</button>
              <button class="danger" @click="supprimer(terrain.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <dialog ref="dialogRef">
      <form @submit.prevent="soumettre">
        <h2>{{ terrainEnEdition ? "Modifier" : "Ajouter" }} un terrain</h2>
        <div class="form-group">
          <label for="nom">Nom</label>
          <input id="nom" v-model="formulaire.nom" required />
        </div>
        <div class="form-group">
          <label for="surface">Surface (m²)</label>
          <input id="surface" type="number" min="0" step="0.01" v-model.number="formulaire.surface" />
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="formulaire.couvert" />
            Terrain couvert
          </label>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="formulaire.eclairage" />
            Éclairage disponible
          </label>
        </div>
        <div class="form-group">
          <label for="localisation">Localisation</label>
          <input id="localisation" v-model="formulaire.localisation" />
        </div>
        <div class="form-actions">
          <button type="submit">Enregistrer</button>
          <button type="button" class="secondary" @click="fermerDialog">Annuler</button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useTerrains } from "../composables/useTerrains";
import Terrain from "src/shared/terrain";

const { terrains, chargerTerrains, creerTerrain, modifierTerrain, supprimerTerrain } = useTerrains();

const dialogRef = ref<HTMLDialogElement | null>(null);
const terrainEnEdition = ref<number | null>(null);

const formulaire = reactive({
  nom: "",
  surface: undefined as number | undefined,
  couvert: false,
  eclairage: false,
  localisation: "",
});

onMounted(async () => {
  await chargerTerrains();
});

const ouvrirDialog = () => {
  terrainEnEdition.value = null;
  reinitialiserFormulaire();
  dialogRef.value?.showModal();
};

const fermerDialog = () => dialogRef.value?.close();

const editerTerrain = (terrain: Terrain) => {
  terrainEnEdition.value = terrain.id ?? null;
  formulaire.nom = terrain.nom;
  formulaire.surface = terrain.surface;
  formulaire.couvert = terrain.couvert;
  formulaire.eclairage = terrain.eclairage;
  formulaire.localisation = terrain.localisation ?? "";
  dialogRef.value?.showModal();
};

const soumettre = async () => {
  const payload: Omit<Terrain, "id"> = {
    nom: formulaire.nom,
    surface: formulaire.surface,
    couvert: formulaire.couvert,
    eclairage: formulaire.eclairage,
    localisation: formulaire.localisation || undefined,
  };

  if (terrainEnEdition.value) {
    await modifierTerrain(terrainEnEdition.value, payload);
  } else {
    await creerTerrain(payload);
  }

  fermerDialog();
};

const supprimer = async (id?: number) => {
  if (!id) return;
  if (confirm("Supprimer ce terrain ?")) {
    await supprimerTerrain(id);
  }
};

const reinitialiserFormulaire = () => {
  formulaire.nom = "";
  formulaire.surface = undefined;
  formulaire.couvert = false;
  formulaire.eclairage = false;
  formulaire.localisation = "";
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #334155;
  padding: 0.5rem 0.75rem;
}

.table th {
  background: #1e293b;
  color: #f8fafc;
  text-align: left;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 320px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

button {
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  background: #2563eb;
  color: white;
}

button.danger {
  background: #dc2626;
}

button.secondary {
  background: #475569;
}
</style>
