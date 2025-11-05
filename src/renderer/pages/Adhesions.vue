<!-- Page Adhesions : affiche et gère les données adhesions -->
<template>
  <div class="page">
    <header class="page__header">
      <h1>Adhésions</h1>
      <button @click="ouvrirDialog">Nouvelle adhésion</button>
    </header>

    <section class="page__content">
      <table class="table">
        <thead>
          <tr>
            <th>Membre</th>
            <th>Type</th>
            <th>Début</th>
            <th>Fin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="adhesion in adhesions" :key="adhesion.id">
            <td>{{ afficherMembre(adhesion.membreId) }}</td>
            <td>{{ adhesion.type }}</td>
            <td>{{ formaterDate(adhesion.dateDebut) }}</td>
            <td>{{ formaterDate(adhesion.dateFin) }}</td>
            <td class="actions">
              <button @click="editerAdhesion(adhesion)">Modifier</button>
              <button class="danger" @click="supprimer(adhesion.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <dialog ref="dialogRef">
      <form @submit.prevent="soumettre">
        <h2>{{ adhesionEnEdition ? "Modifier" : "Créer" }} une adhésion</h2>
        <div class="form-group">
          <label for="membre">Membre</label>
          <select id="membre" v-model.number="formulaire.membreId" required>
            <option disabled value="">Sélectionner un membre</option>
            <option v-for="membre in membres" :key="membre.id" :value="membre.id">
              {{ membre.nom }} {{ membre.prenom }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="type">Type</label>
          <input id="type" v-model="formulaire.type" placeholder="Annuel, Semestre…" required />
        </div>
        <div class="form-group">
          <label for="dateDebut">Date de début</label>
          <input id="dateDebut" type="date" v-model="formulaire.dateDebut" required />
        </div>
        <div class="form-group">
          <label for="dateFin">Date de fin</label>
          <input id="dateFin" type="date" v-model="formulaire.dateFin" required />
        </div>
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
import { useAdhesions } from "../composables/useAdhesions";
import { useMembres } from "../composables/useMembres";
import Adhesion from "src/shared/adhesion";

const { adhesions, chargerToutesAdhesions, creerAdhesion, modifierAdhesion, supprimerAdhesion } = useAdhesions();
const { membres, chargerMembres } = useMembres();

const dialogRef = ref<HTMLDialogElement | null>(null);
const adhesionEnEdition = ref<number | null>(null);
const messageErreur = ref<string>("");

const formulaire = reactive<{
  membreId: number | "";
  type: string;
  dateDebut: string;
  dateFin: string;
}>({
  membreId: "",
  type: "",
  dateDebut: "",
  dateFin: "",
});

onMounted(async () => {
  await Promise.all([chargerToutesAdhesions(), chargerMembres()]);
});

const ouvrirDialog = () => {
  adhesionEnEdition.value = null;
  messageErreur.value = "";
  reinitialiserFormulaire();
  dialogRef.value?.showModal();
};

const fermerDialog = () => {
  dialogRef.value?.close();
};

const afficherMembre = (membreId: number) => {
  const membre = membres.value.find((m) => m.id === membreId);
  return membre ? `${membre.nom} ${membre.prenom}` : membreId;
};

const editerAdhesion = (adhesion: Adhesion) => {
  adhesionEnEdition.value = adhesion.id ?? null;
  formulaire.membreId = adhesion.membreId;
  formulaire.type = adhesion.type;
  formulaire.dateDebut = adhesion.dateDebut ? new Date(adhesion.dateDebut).toISOString().split("T")[0] : "";
  formulaire.dateFin = adhesion.dateFin ? new Date(adhesion.dateFin).toISOString().split("T")[0] : "";
  messageErreur.value = "";
  dialogRef.value?.showModal();
};

const soumettre = async () => {
  if (!formulaire.membreId) {
    messageErreur.value = "Sélectionner un membre.";
    return;
  }
  const debut = new Date(formulaire.dateDebut);
  const fin = new Date(formulaire.dateFin);
  if (Number.isNaN(debut.getTime()) || Number.isNaN(fin.getTime())) {
    messageErreur.value = "Dates invalides.";
    return;
  }
  if (fin <= debut) {
    messageErreur.value = "La date de fin doit être postérieure à la date de début.";
    return;
  }

  const payload = {
    membreId: Number(formulaire.membreId),
    type: formulaire.type,
    dateDebut: debut,
    dateFin: fin,
  } satisfies Omit<Adhesion, "id">;

  if (adhesionEnEdition.value) {
    await modifierAdhesion(adhesionEnEdition.value, payload);
  } else {
    await creerAdhesion(payload);
  }

  fermerDialog();
};

const supprimer = async (id?: number) => {
  if (!id) return;
  if (confirm("Supprimer cette adhésion ?")) {
    await supprimerAdhesion(id);
  }
};

const reinitialiserFormulaire = () => {
  formulaire.membreId = membres.value[0]?.id ?? "";
  formulaire.type = "Annuel";
  formulaire.dateDebut = new Date().toISOString().split("T")[0];
  const fin = new Date();
  fin.setFullYear(fin.getFullYear() + 1);
  formulaire.dateFin = fin.toISOString().split("T")[0];
};

const formaterDate = (date: Date) => {
  const d = new Date(date);
  return d.toLocaleDateString();
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
  gap: 0.25rem;
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
