<!-- Page Adresses : affiche et gère les données adresses -->
<template>
  <div class="page">
    <header class="page__header">
      <h1>Adresses</h1>
      <button @click="ouvrirDialog">Ajouter une adresse</button>
    </header>

    <section class="page__content">
      <table class="table">
        <thead>
          <tr>
            <th>Rue</th>
            <th>Code postal</th>
            <th>Ville</th>
            <th>Pays</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="adresse in adresses" :key="adresse.id">
            <td>{{ adresse.rue }}</td>
            <td>{{ adresse.codePostal }}</td>
            <td>{{ adresse.ville }}</td>
            <td>{{ adresse.pays }}</td>
            <td>
              <button @click="editerAdresse(adresse)">Modifier</button>
              <button class="danger" @click="supprimer(adresse.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <dialog ref="dialogRef">
      <form @submit.prevent="soumettre">
        <h2>{{ adresseEnEdition ? "Modifier" : "Ajouter" }} une adresse</h2>
        <div class="form-group">
          <label for="rue">Rue</label>
          <input id="rue" v-model="formulaire.rue" required />
        </div>
        <div class="form-group">
          <label for="codePostal">Code postal</label>
          <input id="codePostal" v-model="formulaire.codePostal" required />
        </div>
        <div class="form-group">
          <label for="ville">Ville</label>
          <input id="ville" v-model="formulaire.ville" required />
        </div>
        <div class="form-group">
          <label for="pays">Pays</label>
          <input id="pays" v-model="formulaire.pays" required />
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
import { useAdresses } from "../composables/useAdresses";
import Adresse from "src/shared/adresse";

const { adresses, chargerAdresses, creerAdresse, modifierAdresse, supprimerAdresse } = useAdresses();

const dialogRef = ref<HTMLDialogElement | null>(null);
const adresseEnEdition = ref<number | null>(null);

const formulaire = reactive<{
  rue: string;
  codePostal: string;
  ville: string;
  pays: string;
}>({
  rue: "",
  codePostal: "",
  ville: "",
  pays: "France",
});

onMounted(async () => {
  await chargerAdresses();
});

const ouvrirDialog = () => {
  adresseEnEdition.value = null;
  reinitialiserFormulaire();
  dialogRef.value?.showModal();
};

const fermerDialog = () => dialogRef.value?.close();

const editerAdresse = (adresse: Adresse) => {
  adresseEnEdition.value = adresse.id ?? null;
  formulaire.rue = adresse.rue;
  formulaire.codePostal = adresse.codePostal;
  formulaire.ville = adresse.ville;
  formulaire.pays = adresse.pays;
  dialogRef.value?.showModal();
};

const soumettre = async () => {
  const payload: Omit<Adresse, "id"> = {
    rue: formulaire.rue,
    codePostal: formulaire.codePostal,
    ville: formulaire.ville,
    pays: formulaire.pays,
  };

  if (adresseEnEdition.value) {
    await modifierAdresse(adresseEnEdition.value, payload);
  } else {
    await creerAdresse(payload);
  }

  fermerDialog();
};

const supprimer = async (id?: number) => {
  if (!id) return;
  if (confirm("Supprimer cette adresse ?")) {
    await supprimerAdresse(id);
  }
};

const reinitialiserFormulaire = () => {
  formulaire.rue = "";
  formulaire.codePostal = "";
  formulaire.ville = "";
  formulaire.pays = "France";
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

button.danger {
  background: #dc2626;
}

button.secondary {
  background: #475569;
}
</style>
