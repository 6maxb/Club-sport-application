<!-- Page TableauDeBord : affiche et gère les données tableaudebord -->
<template>
  <div class="dashboard">
    <!-- Petit header: bouton de refresh + date de dernière MAJ -->
    <header class="dash__header">
      <h1>Tableau de bord</h1>
      <div class="dash__actions">
        <span class="dash__refresh">Dernière mise à jour: {{ derniereMajTexte }}</span>
        <button class="btn" @click="rafraichir">Rafraîchir</button>
      </div>
    </header>
    <!-- Les cartes sont cliquables: redirigent vers la section -->
    <div class="cards">
      <article class="card link" @click="go('/membres')" tabindex="0" role="button">
        <h2>Membres</h2>
        <p>{{ totalMembres }}</p>
      </article>
      <article class="card link" @click="go('/terrains')" tabindex="0" role="button">
        <h2>Terrains</h2>
        <p>{{ totalTerrains }}</p>
      </article>
      <article class="card link" @click="go('/reservations')" tabindex="0" role="button">
        <h2>Réservations</h2>
        <p>{{ totalReservations }}</p>
      </article>
      <article class="card link" @click="go('/cours')" tabindex="0" role="button">
        <h2>Cours</h2>
        <p>{{ totalCours }}</p>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
// Données récupérées via les composables existants
import { useMembres } from "../composables/useMembres";
import { useTerrains } from "../composables/useTerrains";
import { useReservations } from "../composables/useReservations";
import { useCours } from "../composables/useCours";

const { membres, chargerMembres } = useMembres();
const { terrains, chargerTerrains } = useTerrains();
const { reservations, chargerReservations } = useReservations();
const { cours, chargerCours } = useCours();

// Stocke la date/heure du dernier refresh
const derniereMaj = ref<Date | null>(null);

// Recharge tout et met à jour l'horodatage
const rafraichir = async () => {
  await Promise.all([chargerMembres(), chargerTerrains(), chargerReservations(), chargerCours()]);
  derniereMaj.value = new Date();
};

onMounted(async () => {
  await rafraichir();
});

const totalMembres = computed(() => membres.value.length);
const totalTerrains = computed(() => terrains.value.length);
const totalReservations = computed(() => reservations.value.length);
const totalCours = computed(() => cours.value.length);

// Formatage pour l'affichage dans le header
const derniereMajTexte = computed(() =>
  derniereMaj.value
    ? `${derniereMaj.value.toLocaleDateString()} ${derniereMaj.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : '—',
);

// Ouvre la page ciblée quand on clique une tuile
const router = useRouter();
const go = (path: string) => router.push(path);
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Header du tableau de bord */
.dash__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dash__actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.dash__refresh {
  color: #94a3b8;
  font-size: 0.9rem;
}

/* Grille des cartes */
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

.card.link { cursor: pointer; transition: transform .08s ease; }
.card.link:focus, .card.link:hover { transform: translateY(-2px); box-shadow: 0 20px 30px rgba(37,99,235,.35); }

.btn {
  border: none;
  padding: 0.5rem 0.9rem;
  border-radius: 0.5rem;
  cursor: pointer;
  background: #2563eb;
  color: #fff;
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
