<!-- Page Animations : affiche et gère les données animations -->
<template>
  <div class="page">
    <header class="page__header">
      <h1>Animateurs des cours</h1>
      <RouterLink class="secondary" to="/cours">Retour à la gestion des cours</RouterLink>
    </header>

    <section class="page__content">
      <div class="filters">
        <label>
          Cours
          <select v-model.number="coursSelectionne" @change="charger">
            <option disabled value="">Sélectionner un cours</option>
            <option v-for="cours in coursDisponibles" :key="cours.id" :value="cours.id">
              {{ cours.titre }} – {{ formaterDateHeure(cours.dateHeure) }}
            </option>
          </select>
        </label>
      </div>

      <div v-if="coursSelectionne" class="panel">
        <h2>Assigner un entraîneur</h2>
        <form class="inline-form" @submit.prevent="assignerAnimateur">
          <select v-model.number="entraineurSelectionne" required>
            <option disabled value="">Sélectionner un entraîneur</option>
            <option v-for="membre in entraineursDisponibles" :key="membre.id" :value="membre.id">
              {{ membre.nom }} {{ membre.prenom }}
            </option>
          </select>
          <input type="text" v-model="role" placeholder="Rôle (Principal…)" />
          <input type="number" min="0" step="0.01" v-model.number="remuneration" placeholder="Rémunération (€)" />
          <button type="submit" :disabled="!entraineurSelectionne">Assigner</button>
        </form>
      </div>

      <table class="table" v-if="animateurs.length">
        <thead>
          <tr>
            <th>Membre</th>
            <th>Rôle</th>
            <th>Rémunération</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="animateur in animateurs" :key="animateur.membreId + '-' + animateur.coursId">
            <td>{{ afficherMembre(animateur.membreId) }}</td>
            <td>{{ animateur.role }}</td>
            <td>{{ animateur.remuneration ?? "-" }}</td>
            <td class="actions">
              <button @click="modifierRole(animateur)">Modifier rôle</button>
              <button @click="modifierRemuneration(animateur)">Modifier rémunération</button>
              <button class="danger" @click="retirerAnimateur(animateur)">Retirer</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else-if="coursSelectionne">Aucun animateur assigné pour ce cours.</p>
      <p v-else>Sélectionnez un cours pour afficher les animateurs.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { useAnimations } from "../composables/useAnimations";
import { useCours } from "../composables/useCours";
import { useMembres } from "../composables/useMembres";
import Anime from "src/shared/anime";

const { animateurs, chargerAnimateurs, assigner, retirer, mettreAJourRole, mettreAJourRemuneration } = useAnimations();
const { cours: coursDisponibles, chargerCours } = useCours();
const { membres, chargerMembres } = useMembres();

const coursSelectionne = ref<number | "">("");
const entraineurSelectionne = ref<number | "">("");
const role = ref<string>("Principal");
const remuneration = ref<number | "">("");

const entraineursDisponibles = computed(() =>
  membres.value.filter((m) => m.estEntraineur && !animateurs.value.some((a) => a.membreId === m.id)),
);

onMounted(async () => {
  await Promise.all([chargerCours(), chargerMembres()]);
  if (coursDisponibles.value.length) {
    coursSelectionne.value = coursDisponibles.value[0].id ?? "";
    await charger();
  }
});

const charger = async () => {
  if (coursSelectionne.value) {
    await chargerAnimateurs(Number(coursSelectionne.value));
    entraineurSelectionne.value = entraineursDisponibles.value[0]?.id ?? "";
  } else {
    animateurs.value = [];
  }
};

const assignerAnimateur = async () => {
  if (!coursSelectionne.value || !entraineurSelectionne.value) return;
  await assigner(
    Number(coursSelectionne.value),
    Number(entraineurSelectionne.value),
    role.value || undefined,
    remuneration.value === "" ? undefined : Number(remuneration.value),
  );
  await charger();
  role.value = "Principal";
  remuneration.value = "";
};

const retirerAnimateur = async (animateur: Anime) => {
  if (confirm("Retirer cet entraîneur ?")) {
    await retirer(animateur.coursId, animateur.membreId);
    await charger();
  }
};

const modifierRole = async (animateur: Anime) => {
  const nouveauRole = prompt("Nouveau rôle", animateur.role);
  if (!nouveauRole || !coursSelectionne.value) return;
  await mettreAJourRole(animateur.coursId, animateur.membreId, nouveauRole);
  await charger();
};

const modifierRemuneration = async (animateur: Anime) => {
  const valeur = prompt(
    "Nouvelle rémunération (laisser vide pour aucune)",
    animateur.remuneration?.toString() ?? "",
  );
  if (valeur === null || !coursSelectionne.value) return;
  const montant = valeur.trim() === "" ? 0 : Number(valeur);
  if (Number.isNaN(montant)) return;
  await mettreAJourRemuneration(animateur.coursId, animateur.membreId, montant);
  await charger();
};

const afficherMembre = (id: number) => {
  const membre = membres.value.find((m) => m.id === id);
  return membre ? `${membre.nom} ${membre.prenom}` : id;
};

const formaterDateHeure = (date: Date) => {
  const d = new Date(date);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
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

.filters {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filters select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #475569;
  border-radius: 0.5rem;
  background: #1e293b;
  color: #e2e8f0;
}

.panel {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid #1e293b;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.inline-form {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
}

.inline-form select,
.inline-form input {
  padding: 0.4rem 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid #475569;
  background: #1e293b;
  color: #e2e8f0;
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

.actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

button.danger {
  background: #dc2626;
  color: white;
}
</style>
