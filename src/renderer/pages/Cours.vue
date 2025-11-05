<!-- Page Cours : affiche et gère les données cours -->
<template>
  <div class="page">
    <header class="page__header">
      <h1>Cours</h1>
      <button @click="ouvrirDialogCours" :disabled="!terrains.length">Nouveau cours</button>
    </header>

    <section class="page__content grid">
      <div class="panel">
        <h2>Liste des cours</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Niveau</th>
              <th>Date</th>
              <th>Durée (min)</th>
              <th>Capacité</th>
              <th>Terrain</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="cours in listeCours"
              :key="cours.id"
              :class="{ selected: cours.id === coursSelectionne }"
              @click="selectionnerCours(cours.id!)"
            >
              <td>{{ cours.titre }}</td>
              <td>{{ cours.niveau }}</td>
              <td>{{ formaterDateHeure(cours.dateHeure) }}</td>
              <td>{{ cours.duree }}</td>
              <td>{{ cours.capacite }}</td>
              <td>{{ cours.terrainId }}</td>
              <td class="actions">
                <button @click.stop="editerCours(cours)">Modifier</button>
                <button class="danger" @click.stop="supprimerCoursSelection(cours)">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="!terrains.length" class="notice">
          Aucun terrain disponible. Ajoutez un terrain avant de créer un cours.
        </p>
      </div>

      <div class="panel" v-if="coursSelectionne">
        <h2>Participants</h2>
        <form class="inline-form" @submit.prevent="ajouterParticipant">
          <select v-model.number="membrePourParticipation" required>
            <option disabled value="">Sélectionner un membre</option>
            <option v-for="membre in membresDisponibles" :key="membre.id" :value="membre.id">
              {{ membre.nom }} {{ membre.prenom }}
            </option>
          </select>
          <button type="submit" :disabled="!membrePourParticipation">Ajouter</button>
        </form>

        <table class="table small">
          <thead>
            <tr>
              <th>Membre</th>
              <th>Statut</th>
              <th>Date inscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="participant in participants" :key="participant.membreId">
              <td>{{ afficherMembre(participant.membreId) }}</td>
              <td>{{ participant.statut }}</td>
              <td>{{ formaterDateHeure(participant.dateInscription) }}</td>
              <td class="actions">
                <button @click="mettreStatut(participant, 'Présent')">Présent</button>
                <button @click="mettreStatut(participant, 'Absent')">Absent</button>
                <button class="danger" @click="retirerParticipant(participant)">Retirer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="panel" v-if="coursSelectionne">
        <h2>Animateurs</h2>
        <form class="inline-form" @submit.prevent="assignerAnimateur">
          <select v-model.number="entraineurSelectionne" required>
            <option disabled value="">Sélectionner un entraîneur</option>
            <option v-for="membre in entraineursDisponibles" :key="membre.id" :value="membre.id">
              {{ membre.nom }} {{ membre.prenom }}
            </option>
          </select>
          <input type="text" v-model="roleAnimateur" placeholder="Rôle" />
          <input type="number" min="0" step="0.01" v-model.number="remuneration" placeholder="Rémunération (€)" />
          <button type="submit" :disabled="!entraineurSelectionne">Assigner</button>
        </form>

        <table class="table small">
          <thead>
            <tr>
              <th>Membre</th>
              <th>Rôle</th>
              <th>Rémunération</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="animateur in animateurs" :key="animateur.membreId">
              <td>{{ afficherMembre(animateur.membreId) }}</td>
              <td>{{ animateur.role }}</td>
              <td>{{ animateur.remuneration ?? "-" }}</td>
              <td class="actions">
                <button @click="ouvrirEditionRole(animateur)">Modifier rôle</button>
                <button @click="ouvrirEditionRemuneration(animateur)">Modifier rémunération</button>
                <button class="danger" @click="retirerAnimateur(animateur)">Retirer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <dialog ref="dialogCoursRef">
      <form @submit.prevent="soumettreCours">
        <h2>{{ coursEnEdition ? "Modifier" : "Créer" }} un cours</h2>
        <div class="form-grid">
          <div class="form-group">
            <label for="titre">Titre</label>
            <input id="titre" v-model="formulaireCours.titre" required />
          </div>
          <div class="form-group">
            <label for="niveau">Niveau</label>
            <input id="niveau" v-model="formulaireCours.niveau" required />
          </div>
          <div class="form-group">
            <label for="dateHeure">Date et heure</label>
            <input id="dateHeure" type="datetime-local" v-model="formulaireCours.dateHeure" required />
          </div>
          <div class="form-group">
            <label for="duree">Durée (minutes)</label>
            <input id="duree" type="number" min="15" step="15" v-model.number="formulaireCours.duree" required />
          </div>
          <div class="form-group">
            <label for="capacite">Capacité</label>
            <input id="capacite" type="number" min="1" v-model.number="formulaireCours.capacite" required />
          </div>
          <div class="form-group">
            <label for="terrain">Terrain</label>
            <select id="terrain" v-model.number="formulaireCours.terrainId" required>
              <option disabled value="">Sélectionner un terrain</option>
              <option v-for="terrain in terrains" :key="terrain.id" :value="terrain.id">
                {{ terrain.nom }}
              </option>
            </select>
          </div>
        </div>
        <p v-if="messageCours" class="error">{{ messageCours }}</p>
        <div class="form-actions">
          <button type="submit">Enregistrer</button>
          <button type="button" class="secondary" @click="fermerDialogCours">Annuler</button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useCours } from "../composables/useCours";
import { useMembres } from "../composables/useMembres";
import { useParticipations } from "../composables/useParticipations";
import { useAnimations } from "../composables/useAnimations";
import { useTerrains } from "../composables/useTerrains";
import Participe from "src/shared/participe";
import Anime from "src/shared/anime";
import Cours from "src/shared/cours";

const {
  cours: listeCours,
  chargerCours,
  creerCours,
  modifierCours,
  supprimerCours: supprimerCoursCompo,
} = useCours();
const { terrains, chargerTerrains } = useTerrains();
const { membres, chargerMembres } = useMembres();
const {
  participants,
  chargerParticipants,
  inscrire,
  desinscrire,
  mettreAJourStatut,
} = useParticipations();
const { animateurs, chargerAnimateurs, assigner, retirer, mettreAJourRole, mettreAJourRemuneration } =
  useAnimations();

const coursSelectionne = ref<number | null>(null);
const membrePourParticipation = ref<number | "">("");
const entraineurSelectionne = ref<number | "">("");
const roleAnimateur = ref<string>("Principal");
const remuneration = ref<number | "">("");

const dialogCoursRef = ref<HTMLDialogElement | null>(null);
const coursEnEdition = ref<number | null>(null);
const messageCours = ref<string>("");
const formulaireCours = reactive({
  titre: "",
  niveau: "Débutant",
  dateHeure: "",
  duree: 60,
  capacite: 8,
  terrainId: "" as number | "",
});

const membresDisponibles = computed(() =>
  membres.value.filter((m) => !participants.value.some((p) => p.membreId === m.id)),
);

const entraineursDisponibles = computed(() =>
  membresDisponibles.value.filter((m) => m.estEntraineur),
);

const formatDateTimeLocal = (value: Date | string) => {
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const reinitialiserFormulaireCours = () => {
  formulaireCours.titre = "";
  formulaireCours.niveau = "Débutant";
  formulaireCours.dateHeure = formatDateTimeLocal(new Date());
  formulaireCours.duree = 60;
  formulaireCours.capacite = 8;
  formulaireCours.terrainId = terrains.value[0]?.id ?? "";
};

onMounted(async () => {
  await Promise.all([chargerCours(), chargerMembres(), chargerTerrains()]);
  reinitialiserFormulaireCours();
  if (listeCours.value.length) {
    selectionnerCours(listeCours.value[0].id!, true);
  }
});

const selectionnerCours = async (id: number, force = false) => {
  if (!force && coursSelectionne.value === id) return;
  coursSelectionne.value = id;
  await Promise.all([chargerParticipants(id), chargerAnimateurs(id)]);
  membrePourParticipation.value = membresDisponibles.value[0]?.id ?? "";
  entraineurSelectionne.value = entraineursDisponibles.value[0]?.id ?? "";
};

const ouvrirDialogCours = () => {
  coursEnEdition.value = null;
  messageCours.value = terrains.value.length ? "" : "Aucun terrain disponible. Ajoutez un terrain.";
  reinitialiserFormulaireCours();
  dialogCoursRef.value?.showModal();
};

const fermerDialogCours = () => {
  dialogCoursRef.value?.close();
};

const editerCours = (cours: Cours) => {
  if (!cours.id) return;
  coursEnEdition.value = cours.id;
  messageCours.value = "";
  formulaireCours.titre = cours.titre;
  formulaireCours.niveau = cours.niveau;
  formulaireCours.dateHeure = formatDateTimeLocal(cours.dateHeure);
  formulaireCours.duree = cours.duree;
  formulaireCours.capacite = cours.capacite;
  formulaireCours.terrainId = cours.terrainId;
  dialogCoursRef.value?.showModal();
};

const soumettreCours = async () => {
  if (!formulaireCours.terrainId) {
    messageCours.value = "Sélectionner un terrain.";
    return;
  }

  const date = new Date(formulaireCours.dateHeure);
  if (Number.isNaN(date.getTime())) {
    messageCours.value = "Date ou heure invalide.";
    return;
  }

  if (formulaireCours.duree <= 0) {
    messageCours.value = "La durée doit être positive.";
    return;
  }

  if (formulaireCours.capacite <= 0) {
    messageCours.value = "La capacité doit être positive.";
    return;
  }

  const payload = {
    titre: formulaireCours.titre.trim(),
    niveau: formulaireCours.niveau.trim(),
    dateHeure: date,
    duree: Number(formulaireCours.duree),
    capacite: Number(formulaireCours.capacite),
    terrainId: Number(formulaireCours.terrainId),
  } satisfies Omit<Cours, "id">;

  try {
    if (coursEnEdition.value) {
      const updated = await modifierCours(coursEnEdition.value, payload);
      if (updated?.id) {
        await selectionnerCours(updated.id, true);
      }
    } else {
      const created = await creerCours(payload);
      if (created?.id) {
        await selectionnerCours(created.id, true);
      }
    }
    fermerDialogCours();
  } catch (error: unknown) {
    messageCours.value =
      error instanceof Error ? error.message : "Erreur lors de l'enregistrement du cours.";
  }
};

const supprimerCoursSelection = async (cours: Cours) => {
  if (!cours.id) return;
  if (!confirm("Supprimer ce cours ?")) return;

  await supprimerCoursCompo(cours.id);

  if (listeCours.value.length) {
    await selectionnerCours(listeCours.value[0].id!, true);
  } else {
    coursSelectionne.value = null;
  }
};

const formaterDateHeure = (date: Date) => {
  const d = new Date(date);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

const afficherMembre = (membreId: number) => {
  const membre = membres.value.find((m) => m.id === membreId);
  return membre ? `${membre.nom} ${membre.prenom}` : membreId;
};

const ajouterParticipant = async () => {
  if (!coursSelectionne.value || !membrePourParticipation.value) return;
  await inscrire(coursSelectionne.value, Number(membrePourParticipation.value));
  await chargerParticipants(coursSelectionne.value);
  membrePourParticipation.value = membresDisponibles.value[0]?.id ?? "";
};

const retirerParticipant = async (participant: Participe) => {
  if (!coursSelectionne.value) return;
  if (confirm("Retirer ce participant ?")) {
    await desinscrire(participant.coursId, participant.membreId);
    await chargerParticipants(coursSelectionne.value);
    membrePourParticipation.value = membresDisponibles.value[0]?.id ?? "";
  }
};

const mettreStatut = async (participant: Participe, statut: string) => {
  if (!coursSelectionne.value) return;
  await mettreAJourStatut(participant.coursId, participant.membreId, statut);
  await chargerParticipants(coursSelectionne.value);
};

const assignerAnimateur = async () => {
  if (!coursSelectionne.value || !entraineurSelectionne.value) return;
  await assigner(
    coursSelectionne.value,
    Number(entraineurSelectionne.value),
    roleAnimateur.value || undefined,
    remuneration.value === "" ? undefined : Number(remuneration.value),
  );
  await chargerAnimateurs(coursSelectionne.value);
  entraineurSelectionne.value = entraineursDisponibles.value[0]?.id ?? "";
  roleAnimateur.value = "Principal";
  remuneration.value = "";
};

const retirerAnimateur = async (animateur: Anime) => {
  if (!coursSelectionne.value) return;
  if (confirm("Retirer cet entraîneur ?")) {
    await retirer(animateur.coursId, animateur.membreId);
    await chargerAnimateurs(coursSelectionne.value);
    entraineurSelectionne.value = entraineursDisponibles.value[0]?.id ?? "";
  }
};

const ouvrirEditionRole = async (animateur: Anime) => {
  const nouveauRole = prompt("Nouveau rôle", animateur.role);
  if (!nouveauRole || !coursSelectionne.value) return;
  await mettreAJourRole(animateur.coursId, animateur.membreId, nouveauRole);
  await chargerAnimateurs(coursSelectionne.value);
  entraineurSelectionne.value = entraineursDisponibles.value[0]?.id ?? "";
};

const ouvrirEditionRemuneration = async (animateur: Anime) => {
  const nouvelleRemu = prompt(
    "Nouvelle rémunération (laisser vide pour aucune)",
    animateur.remuneration?.toString() ?? "",
  );
  if (nouvelleRemu === null || !coursSelectionne.value) return;
  const valeur =
    nouvelleRemu.trim() === "" ? 0 : Number.isNaN(Number(nouvelleRemu)) ? undefined : Number(nouvelleRemu);
  await mettreAJourRemuneration(animateur.coursId, animateur.membreId, valeur ?? 0);
  await chargerAnimateurs(coursSelectionne.value);
  entraineurSelectionne.value = entraineursDisponibles.value[0]?.id ?? "";
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
  align-items: center;
  justify-content: space-between;
}

.page__content.grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.panel {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid #1e293b;
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.table tr.selected {
  background: rgba(37, 99, 235, 0.15);
}

.table.small td,
.table.small th {
  font-size: 0.9rem;
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

.actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

button {
  border: none;
  padding: 0.45rem 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  background: #2563eb;
  color: white;
}

button.danger {
  background: #dc2626;
}

.notice {
  margin-top: 1rem;
  color: #facc15;
}

dialog {
  border: none;
  border-radius: 0.75rem;
  background: #0f172a;
  color: #e2e8f0;
  padding: 1.5rem;
}

dialog::backdrop {
  background: rgba(15, 23, 42, 0.65);
}

dialog form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 360px;
}

.form-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-group input,
.form-group select {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #475569;
  background: #1e293b;
  color: #e2e8f0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

button.secondary {
  background: #475569;
}

.error {
  color: #f87171;
}
</style>
