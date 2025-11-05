<!-- Page Membres : affiche et gère les données membres -->
<template>
  <div class="page">
    <header class="page__header">
      <h1>Membres</h1>
      <button @click="ouvrirFormulaire" :disabled="!adresses.length">Ajouter un membre</button>
      <RouterLink class="secondary" to="/adresses">Gérer les adresses</RouterLink>
    </header>

    <section class="page__content">
      <table class="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Adresse</th>
            <th>Entraîneur</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="membre in membres" :key="membre.id">
            <td>{{ membre.nom }}</td>
            <td>{{ membre.prenom }}</td>
            <td>{{ membre.email }}</td>
            <td>{{ membre.telephone || "-" }}</td>
            <td>{{ afficherAdresse(membre.adresseId) }}</td>
            <td>{{ membre.estEntraineur ? "Oui" : "Non" }}</td>
            <td>
              <button @click="editerMembre(membre)">Modifier</button>
              <button class="danger" @click="supprimer(membre.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="!adresses.length" class="notice">
        Aucune adresse disponible. Merci d'en créer une dans la section « Adresses » avant d'ajouter des membres.
      </p>
    </section>

    <dialog ref="dialogRef">
      <form @submit.prevent="soumettreFormulaire">
        <h2>{{ editionEnCours ? "Modifier" : "Ajouter" }} un membre</h2>
        <div class="form-group">
          <label for="nom">Nom</label>
          <input id="nom" v-model="formulaire.nom" required />
        </div>
        <div class="form-group">
          <label for="prenom">Prénom</label>
          <input id="prenom" v-model="formulaire.prenom" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" v-model="formulaire.email" required />
        </div>
        <div class="form-group">
          <label for="telephone">Téléphone</label>
          <input id="telephone" v-model="formulaire.telephone" />
        </div>
        <div class="form-group">
          <label for="date-naissance">Date de naissance</label>
          <input id="date-naissance" type="date" v-model="formulaire.dateNaissance" required />
        </div>
        <div class="form-group">
          <label for="adresse">Adresse</label>
          <select id="adresse" v-model.number="adresseSelectionnee" required>
            <option disabled value="">Sélectionner une adresse</option>
            <option v-for="adresse in adresses" :key="adresse.id" :value="adresse.id">
              {{ adresse.rue }}, {{ adresse.codePostal }} {{ adresse.ville }} ({{ adresse.pays }})
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="formulaire.estEntraineur" />
            Est entraîneur
          </label>
        </div>
        <div class="form-group" v-if="formulaire.estEntraineur">
          <label for="specialite">Spécialité</label>
          <input id="specialite" v-model="formulaire.specialite" />
        </div>
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
import { RouterLink } from "vue-router";
import { useMembres } from "../composables/useMembres";
import { useAdresses } from "../composables/useAdresses";
import Membre from "src/shared/membre";

const { membres, chargerMembres, creerMembre, modifierMembre, supprimerMembre } = useMembres();
const { adresses, chargerAdresses } = useAdresses();

const dialogRef = ref<HTMLDialogElement | null>(null);
const editionEnCours = ref<number | null>(null);
const adresseSelectionnee = ref<number | "">("");

const formulaire = reactive({
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  dateNaissance: "",
  estEntraineur: false,
  specialite: "",
});

onMounted(async () => {
  await Promise.all([chargerMembres(), chargerAdresses()]);
});

const ouvrirFormulaire = () => {
  editionEnCours.value = null;
  reinitialiserFormulaire();
  dialogRef.value?.showModal();
};

const fermerFormulaire = () => {
  dialogRef.value?.close();
};

const afficherAdresse = (adresseId?: number) => {
  if (!adresseId) return "-";
  const adresse = adresses.value.find((a) => a.id === adresseId);
  if (!adresse) return "-";
  return `${adresse.rue}, ${adresse.codePostal} ${adresse.ville}`;
};

const editerMembre = (membre: Membre) => {
  editionEnCours.value = membre.id ?? null;
  formulaire.nom = membre.nom;
  formulaire.prenom = membre.prenom;
  formulaire.email = membre.email;
  formulaire.telephone = membre.telephone ?? "";
  formulaire.dateNaissance = membre.dateNaissance
    ? new Date(membre.dateNaissance).toISOString().split("T")[0]
    : "";
  formulaire.estEntraineur = membre.estEntraineur;
  formulaire.specialite = membre.specialite ?? "";
  adresseSelectionnee.value = membre.adresseId ?? "";
  dialogRef.value?.showModal();
};

const soumettreFormulaire = async () => {
  if (!adresseSelectionnee.value) {
    alert("Merci de sélectionner une adresse.");
    return;
  }

  const date = new Date(formulaire.dateNaissance);
  if (Number.isNaN(date.getTime())) {
    alert("Date de naissance invalide");
    return;
  }

  const payload = {
    nom: formulaire.nom,
    prenom: formulaire.prenom,
    email: formulaire.email,
    telephone: formulaire.telephone || undefined,
    dateNaissance: date,
    estEntraineur: formulaire.estEntraineur,
    specialite: formulaire.estEntraineur ? formulaire.specialite || undefined : undefined,
    adresseId: Number(adresseSelectionnee.value),
    estActif: true,
  } satisfies Omit<Membre, "id">;

  if (editionEnCours.value) {
    await modifierMembre(editionEnCours.value, payload);
  } else {
    await creerMembre(payload);
  }

  fermerFormulaire();
};

const supprimer = async (id?: number) => {
  if (!id) return;
  if (confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
    await supprimerMembre(id);
  }
};

const reinitialiserFormulaire = () => {
  formulaire.nom = "";
  formulaire.prenom = "";
  formulaire.email = "";
  formulaire.telephone = "";
  formulaire.dateNaissance = "";
  formulaire.estEntraineur = false;
  formulaire.specialite = "";
  adresseSelectionnee.value = adresses.value[0]?.id ?? "";
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

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
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
</style>
