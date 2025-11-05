<!-- Page Paiements : affiche et gère les données paiements -->
<template>
  <div class="page">
    <header class="page__header">
      <h1>Paiements</h1>
      <button @click="ouvrirDialog">Enregistrer un paiement</button>
    </header>

    <section class="page__content">
      <table class="table">
        <thead>
          <tr>
            <th>Référence</th>
            <th>Montant</th>
            <th>Date</th>
            <th>Type</th>
            <th>Mode</th>
            <th>Concerné</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="paiement in paiements" :key="paiement.id">
            <td>{{ paiement.id }}</td>
            <td>{{ paiement.montant.toFixed(2) }} €</td>
            <td>{{ formaterDate(paiement.datePaiement) }}</td>
            <td>{{ paiement.typePaiement ?? "-" }}</td>
            <td>{{ paiement.modePaiement ?? "-" }}</td>
            <td>{{ afficherCible(paiement) }}</td>
            <td class="actions">
              <button class="danger" @click="supprimer(paiement.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <dialog ref="dialogRef">
      <form @submit.prevent="soumettre">
        <h2>Nouveau paiement</h2>
        <div class="form-group">
          <label for="montant">Montant (€)</label>
          <input id="montant" type="number" min="0.01" step="0.01" v-model.number="formulaire.montant" required />
        </div>
        <div class="form-group">
          <label for="datePaiement">Date de paiement</label>
          <input id="datePaiement" type="date" v-model="formulaire.datePaiement" required />
        </div>
        <div class="form-group">
          <label for="typePaiement">Type</label>
          <input id="typePaiement" v-model="formulaire.typePaiement" placeholder="Ex: Carte, Virement" />
        </div>
        <div class="form-group">
          <label for="modePaiement">Mode</label>
          <input id="modePaiement" v-model="formulaire.modePaiement" placeholder="Ex: Unique, échelonné" />
        </div>

        <fieldset class="form-group">
          <legend>Concerne</legend>
          <div class="radio">
            <label><input type="radio" value="adhesion" v-model="formulaire.cible.type" /> Adhésion</label>
            <select
              v-if="formulaire.cible.type === 'adhesion'"
              v-model.number="formulaire.cible.id"
              required
            >
              <option disabled value="">Sélectionner une adhésion</option>
              <option v-for="adhesion in adhesions" :key="adhesion.id" :value="adhesion.id">
                {{ afficherMembre(adhesion.membreId) }} – {{ adhesion.type }}
              </option>
            </select>
          </div>
          <div class="radio">
            <label><input type="radio" value="reservation" v-model="formulaire.cible.type" /> Réservation</label>
            <select
              v-if="formulaire.cible.type === 'reservation'"
              v-model.number="formulaire.cible.id"
              required
            >
              <option disabled value="">Sélectionner une réservation</option>
              <option v-for="reservation in reservations" :key="reservation.id" :value="reservation.id">
                {{ afficherMembre(reservation.membreId) }} – {{ formaterDate(reservation.dateReservation) }}
              </option>
            </select>
          </div>
          <div class="radio">
            <label><input type="radio" value="cours" v-model="formulaire.cible.type" /> Cours</label>
            <select
              v-if="formulaire.cible.type === 'cours'"
              v-model.number="formulaire.cible.id"
              required
            >
              <option disabled value="">Sélectionner un cours</option>
              <option v-for="cours in cours" :key="cours.id" :value="cours.id">
                {{ cours.titre }} – {{ formaterDateHeure(cours.dateHeure) }}
              </option>
            </select>
          </div>
        </fieldset>

        <p v-if="messageErreur" class="error">{{ messageErreur }}</p>

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
import { usePaiements } from "../composables/usePaiements";
import { useAdhesions } from "../composables/useAdhesions";
import { useReservations } from "../composables/useReservations";
import { useCours } from "../composables/useCours";
import { useMembres } from "../composables/useMembres";
import Paiement from "src/shared/paiement";

const { paiements, chargerTousPaiements, enregistrerPaiement, supprimerPaiement } = usePaiements();
const { adhesions, chargerToutesAdhesions } = useAdhesions();
const { reservations, chargerReservations } = useReservations();
const { cours, chargerCours } = useCours();
const { membres, chargerMembres } = useMembres();

const dialogRef = ref<HTMLDialogElement | null>(null);
const messageErreur = ref<string>("");

const formulaire = reactive<{
  montant: number;
  datePaiement: string;
  typePaiement: string;
  modePaiement: string;
  cible: { type: "adhesion" | "reservation" | "cours" | ""; id: number | "" };
}>({
  montant: 0,
  datePaiement: new Date().toISOString().split("T")[0],
  typePaiement: "",
  modePaiement: "",
  cible: { type: "", id: "" },
});

onMounted(async () => {
  await Promise.all([
    chargerTousPaiements(),
    chargerToutesAdhesions(),
    chargerReservations(),
    chargerCours(),
    chargerMembres(),
  ]);
});

const ouvrirDialog = () => {
  messageErreur.value = "";
  reinitialiserFormulaire();
  dialogRef.value?.showModal();
};

const fermerDialog = () => dialogRef.value?.close();

const afficherMembre = (id: number) => {
  const membre = membres.value.find((m) => m.id === id);
  return membre ? `${membre.nom} ${membre.prenom}` : id;
};

const afficherCible = (paiement: Paiement) => {
  if (paiement.adhesionId) {
    const adhesion = adhesions.value.find((a) => a.id === paiement.adhesionId);
    return adhesion ? `Adhésion ${adhesion.id} – ${afficherMembre(adhesion.membreId)}` : `Adhésion ${paiement.adhesionId}`;
  }
  if (paiement.reservationId) {
    const reservation = reservations.value.find((r) => r.id === paiement.reservationId);
    return reservation
      ? `Réservation ${reservation.id} – ${afficherMembre(reservation.membreId)} (${formaterDate(reservation.dateReservation)})`
      : `Réservation ${paiement.reservationId}`;
  }
  if (paiement.coursId) {
    const coursTrouve = cours.value.find((c) => c.id === paiement.coursId);
    return coursTrouve ? `Cours ${coursTrouve.titre}` : `Cours ${paiement.coursId}`;
  }
  return "-";
};

const soumettre = async () => {
  if (formulaire.montant <= 0) {
    messageErreur.value = "Le montant doit être positif.";
    return;
  }
  if (!formulaire.cible.type || !formulaire.cible.id) {
    messageErreur.value = "Sélectionner une entité concernée.";
    return;
  }
  const date = new Date(formulaire.datePaiement);
  if (Number.isNaN(date.getTime())) {
    messageErreur.value = "Date invalide.";
    return;
  }

  const payload: Omit<Paiement, "id"> = {
    montant: formulaire.montant,
    datePaiement: date,
    typePaiement: formulaire.typePaiement || undefined,
    modePaiement: formulaire.modePaiement || undefined,
    adhesionId: formulaire.cible.type === "adhesion" ? Number(formulaire.cible.id) : undefined,
    reservationId: formulaire.cible.type === "reservation" ? Number(formulaire.cible.id) : undefined,
    coursId: formulaire.cible.type === "cours" ? Number(formulaire.cible.id) : undefined,
  };

  await enregistrerPaiement(payload);
  fermerDialog();
};

const supprimer = async (id?: number) => {
  if (!id) return;
  if (confirm("Supprimer ce paiement ?")) {
    await supprimerPaiement(id);
  }
};

const formaterDate = (date: Date) => {
  const d = new Date(date);
  return d.toLocaleDateString();
};

const formaterDateHeure = (date: Date) => {
  const d = new Date(date);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

const reinitialiserFormulaire = () => {
  formulaire.montant = 0;
  formulaire.datePaiement = new Date().toISOString().split("T")[0];
  formulaire.typePaiement = "";
  formulaire.modePaiement = "";
  formulaire.cible.type = "adhesion";
  formulaire.cible.id = adhesions.value[0]?.id ?? "";
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

.actions {
  display: flex;
  gap: 0.5rem;
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
  gap: 0.5rem;
}

.form-group select,
.form-group input {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #475569;
  background: #1e293b;
  color: #e2e8f0;
}

.radio {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
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
