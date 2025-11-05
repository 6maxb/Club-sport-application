<!-- Page Participations : affiche et gère les données participations -->
<template>
  <div class="page">
    <header class="page__header">
      <h1>Participations aux cours</h1>
      <RouterLink class="secondary" to="/cours">Gestion des cours</RouterLink>
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
        <h2>Ajouter un participant</h2>
        <form class="inline-form" @submit.prevent="ajouterParticipant">
          <select v-model.number="membreSelectionne" required>
            <option disabled value="">Sélectionner un membre</option>
            <option v-for="membre in membresDisponibles" :key="membre.id" :value="membre.id">
              {{ membre.nom }} {{ membre.prenom }}
            </option>
          </select>
          <select v-model="statutSelectionne">
            <option value="Inscrit">Inscrit</option>
            <option value="Présent">Présent</option>
            <option value="Absent">Absent</option>
          </select>
          <button type="submit" :disabled="!membreSelectionne">Ajouter</button>
        </form>
      </div>

      <table class="table" v-if="participants.length">
        <thead>
          <tr>
            <th>Membre</th>
            <th>Statut</th>
            <th>Date d'inscription</th>
            <th>Modifier le statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="participant in participants" :key="participant.membreId + '-' + participant.coursId">
            <td>{{ afficherMembre(participant.membreId) }}</td>
            <td>{{ participant.statut }}</td>
            <td>{{ formaterDate(participant.dateInscription) }}</td>
            <td>
              <select v-model="statutsTemp[participant.membreId]" @change="changerStatut(participant)">
                <option value="Inscrit">Inscrit</option>
                <option value="Présent">Présent</option>
                <option value="Absent">Absent</option>
              </select>
            </td>
            <td>
              <button class="danger" @click="retirer(participant)">Retirer</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else-if="coursSelectionne">Aucun participant pour ce cours pour le moment.</p>
      <p v-else>Sélectionnez un cours pour afficher les participants.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import { useParticipations } from "../composables/useParticipations";
import { useCours } from "../composables/useCours";
import { useMembres } from "../composables/useMembres";
import Participe from "src/shared/participe";

const { participants, chargerParticipants, inscrire, desinscrire, mettreAJourStatut } = useParticipations();
const { cours: coursDisponibles, chargerCours } = useCours();
const { membres, chargerMembres } = useMembres();

const coursSelectionne = ref<number | "">("");
const membreSelectionne = ref<number | "">("");
const statutSelectionne = ref<string>("Inscrit");
const statutsTemp = reactive<Record<number, string>>({});

const membresDisponibles = computed(() =>
  membres.value.filter((m) => !participants.value.some((p) => p.membreId === m.id)),
);

onMounted(async () => {
  await Promise.all([chargerCours(), chargerMembres()]);
  if (coursDisponibles.value.length) {
    coursSelectionne.value = coursDisponibles.value[0].id ?? "";
    await charger();
  }
});

watch(participants, (nouveaux) => {
  nouveaux.forEach((p) => {
    statutsTemp[p.membreId] = p.statut;
  });
});

const charger = async () => {
  if (coursSelectionne.value) {
    await chargerParticipants(Number(coursSelectionne.value));
    membreSelectionne.value = membresDisponibles.value[0]?.id ?? "";
  } else {
    participants.value = [];
  }
};

const ajouterParticipant = async () => {
  if (!coursSelectionne.value || !membreSelectionne.value) return;
  await inscrire(Number(coursSelectionne.value), Number(membreSelectionne.value));
  if (statutSelectionne.value !== "Inscrit") {
    await mettreAJourStatut(Number(coursSelectionne.value), Number(membreSelectionne.value), statutSelectionne.value);
  }
  await charger();
  statutSelectionne.value = "Inscrit";
};

const retirer = async (participant: Participe) => {
  if (confirm("Retirer ce participant du cours ?")) {
    await desinscrire(participant.coursId, participant.membreId);
    await charger();
  }
};

const changerStatut = async (participant: Participe) => {
  await mettreAJourStatut(participant.coursId, participant.membreId, statutsTemp[participant.membreId]);
  await charger();
};

const afficherMembre = (id: number) => {
  const membre = membres.value.find((m) => m.id === id);
  return membre ? `${membre.nom} ${membre.prenom}` : id;
};

const formaterDate = (date: Date) => {
  const d = new Date(date);
  return d.toLocaleString();
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
  gap: 1rem;
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

.inline-form select {
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

.table select {
  padding: 0.3rem 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #475569;
  background: #1e293b;
  color: #e2e8f0;
}

button.danger {
  background: #dc2626;
  color: white;
}
</style>
