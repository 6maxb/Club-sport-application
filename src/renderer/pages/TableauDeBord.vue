<!-- Page TableauDeBord : affiche et gère les données tableaudebord -->
<template>
  <div class="dashboard">
    <h1>Tableau de bord</h1>
    <div class="cards">
      <article class="card">
        <h2>Membres</h2>
        <p>{{ totalMembres }}</p>
      </article>
      <article class="card">
        <h2>Terrains</h2>
        <p>{{ totalTerrains }}</p>
      </article>
      <article class="card">
        <h2>Réservations</h2>
        <p>{{ totalReservations }}</p>
      </article>
      <article class="card">
        <h2>Cours</h2>
        <p>{{ totalCours }}</p>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useMembres } from "../composables/useMembres";
import { useTerrains } from "../composables/useTerrains";
import { useReservations } from "../composables/useReservations";
import { useCours } from "../composables/useCours";

const { membres, chargerMembres } = useMembres();
const { terrains, chargerTerrains } = useTerrains();
const { reservations, chargerReservations } = useReservations();
const { cours, chargerCours } = useCours();

onMounted(async () => {
  await Promise.all([chargerMembres(), chargerTerrains(), chargerReservations(), chargerCours()]);
});

const totalMembres = computed(() => membres.value.length);
const totalTerrains = computed(() => terrains.value.length);
const totalReservations = computed(() => reservations.value.length);
const totalCours = computed(() => cours.value.length);
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.card {
  background: linear-gradient(135deg, #1e3a8a, #2563eb);
  color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 15px 25px rgba(37, 99, 235, 0.25);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card h2 {
  font-size: 1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.8;
}

.card p {
  font-size: 2.5rem;
  font-weight: 700;
}
</style>
