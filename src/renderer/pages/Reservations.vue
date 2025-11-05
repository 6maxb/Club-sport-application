<!-- Page Reservations : affiche et gère les données reservations -->
<template>
  <div class="page">
    <header class="page__header">
      <h1>Réservations</h1>
      <div class="header-actions">
        <button @click="ouvrirFormulaire">Nouvelle réservation</button>
      </div>
    </header>

    <section class="page__content">
      <table class="table">
        <thead>
          <tr>
            <th>Membre</th>
            <th>Terrain</th>
            <th>Date</th>
            <th>Début</th>
            <th>Fin</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reservation in reservations" :key="reservation.id">
            <td>{{ afficherMembre(reservation.membreId) }}</td>
            <td>{{ afficherTerrain(reservation.terrainId) }}</td>
            <td>{{ formaterDate(reservation.dateReservation) }}</td>
            <td>{{ reservation.heureDebut }}</td>
            <td>{{ reservation.heureFin }}</td>
            <td>{{ reservation.statut }}</td>
            <td class="actions">
              <button @click="editerReservation(reservation)">Modifier</button>
              <button @click="annuler(reservation.id)">Annuler</button>
              <button class="danger" @click="supprimer(reservation.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <dialog ref="dialogRef">
      <form @submit.prevent="soumettre">
        <h2>{{ reservationEnEdition ? "Modifier" : "Créer" }} une réservation</h2>
        <div class="form-group">
          <label for="membre">Membre</label>
          <select id="membre" v-model.number="formulaire.membreId" required>
            <option disabled value="">Sélectionner un membre</option>
            <option v-for="membre in membres" :key="membre.id" :value="membre.id">
              {{ membre.nom }} {{ membre.prenom }} ({{ membre.email }})
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="terrain">Terrain</label>
          <select id="terrain" v-model.number="formulaire.terrainId" required>
            <option disabled value="">Sélectionner un terrain</option>
            <option v-for="terrain in terrains" :key="terrain.id" :value="terrain.id">
              {{ terrain.nom }} ({{ terrain.localisation ?? "Localisation inconnue" }})
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="date">Date</label>
          <input id="date" type="date" v-model="formulaire.date" required />
        </div>
        <div class="form-group">
          <label>Créneau</label>
          <div class="time-row">
            <input type="time" v-model="formulaire.heureDebut" required />
            <span>à</span>
            <input type="time" v-model="formulaire.heureFin" required />
          </div>
        </div>
        <div class="form-group">
          <label for="statut">Statut</label>
          <select id="statut" v-model="formulaire.statut">
            <option value="Confirmée">Confirmée</option>
            <option value="En attente">En attente</option>
            <option value="Annulée">Annulée</option>
          </select>
        </div>
        <p v-if="messageErreur" class="error">{{ messageErreur }}</p>
        <div class="form-actions">
          <button type="submit">Enregistrer</button>
          <button type="button" class="secondary" @click="fermerFormulaire">Annuler</button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useReservations } from "../composables/useReservations";
import { useMembres } from "../composables/useMembres";
import { useTerrains } from "../composables/useTerrains";
import Reservation from "src/shared/reservation";

const { reservations, chargerReservations, creerReservation, modifierReservation, annulerReservation, supprimerReservation, verifierDisponibilite } =
  useReservations();
const { membres, chargerMembres } = useMembres();
const { terrains, chargerTerrains } = useTerrains();

const dialogRef = ref<HTMLDialogElement | null>(null);
const reservationEnEdition = ref<number | null>(null);
const messageErreur = ref<string>("");

const formulaire = reactive<{
  membreId: number | "";
  terrainId: number | "";
  date: string;
  heureDebut: string;
  heureFin: string;
  statut: string;
}>({
  membreId: "",
  terrainId: "",
  date: "",
  heureDebut: "09:00",
  heureFin: "10:00",
  statut: "Confirmée",
});

onMounted(async () => {
  await Promise.all([chargerReservations(), chargerMembres(), chargerTerrains()]);
});

const ouvrirFormulaire = () => {
  reservationEnEdition.value = null;
  messageErreur.value = "";
  reinitialiserFormulaire();
  dialogRef.value?.showModal();
};

const fermerFormulaire = () => {
  dialogRef.value?.close();
};

const editerReservation = (reservation: Reservation) => {
  reservationEnEdition.value = reservation.id ?? null;
  formulaire.membreId = reservation.membreId;
  formulaire.terrainId = reservation.terrainId;
  formulaire.date = reservation.dateReservation
    ? new Date(reservation.dateReservation).toISOString().split("T")[0]
    : "";
  formulaire.heureDebut = reservation.heureDebut.slice(0, 5);
  formulaire.heureFin = reservation.heureFin.slice(0, 5);
  formulaire.statut = reservation.statut;
  messageErreur.value = "";
  dialogRef.value?.showModal();
};

const soumettre = async () => {
  if (!formulaire.membreId || !formulaire.terrainId) {
    messageErreur.value = "Membre et terrain sont obligatoires.";
    return;
  }

  const date = new Date(formulaire.date);
  if (Number.isNaN(date.getTime())) {
    messageErreur.value = "Date invalide.";
    return;
  }

  if (formulaire.heureFin <= formulaire.heureDebut) {
    messageErreur.value = "L'heure de fin doit être supérieure à l'heure de début.";
    return;
  }

  const disponible = await verifierDisponibilite(
    formulaire.terrainId,
    date,
    formulaire.heureDebut,
    formulaire.heureFin,
    reservationEnEdition.value ?? undefined,
  );

  if (!disponible) {
    messageErreur.value = "Le terrain est indisponible sur ce créneau.";
    return;
  }

  const payload = {
    membreId: Number(formulaire.membreId),
    terrainId: Number(formulaire.terrainId),
    dateReservation: date,
    heureDebut: `${formulaire.heureDebut}:00`,
    heureFin: `${formulaire.heureFin}:00`,
    statut: formulaire.statut,
  } satisfies Omit<Reservation, "id" | "dateCreation">;

  if (reservationEnEdition.value) {
    await modifierReservation(reservationEnEdition.value, payload);
  } else {
    await creerReservation(payload);
  }

  fermerFormulaire();
};

const annuler = async (id?: number) => {
  if (!id) return;
  if (confirm("Annuler cette réservation ?")) {
    await annulerReservation(id);
  }
};

const supprimer = async (id?: number) => {
  if (!id) return;
  if (confirm("Supprimer définitivement cette réservation ?")) {
    await supprimerReservation(id);
  }
};

const afficherMembre = (membreId: number) => {
  const membre = membres.value.find((m) => m.id === membreId);
  return membre ? `${membre.nom} ${membre.prenom}` : membreId;
};

const afficherTerrain = (terrainId: number) => {
  const terrain = terrains.value.find((t) => t.id === terrainId);
  return terrain ? terrain.nom : terrainId;
};

const formaterDate = (date: Date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString();
};

const reinitialiserFormulaire = () => {
  formulaire.membreId = membres.value[0]?.id ?? "";
  formulaire.terrainId = terrains.value[0]?.id ?? "";
  formulaire.date = new Date().toISOString().split("T")[0];
  formulaire.heureDebut = "09:00";
  formulaire.heureFin = "10:00";
  formulaire.statut = "Confirmée";
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

.header-actions {
  display: flex;
  gap: 0.75rem;
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
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 340px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.time-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

button {
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  background: #2563eb;
  color: white;
}

button.secondary {
  background: #475569;
}

button.danger {
  background: #dc2626;
}

.error {
  color: #f87171;
}
</style>
