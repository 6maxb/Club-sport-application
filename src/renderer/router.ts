// Déclaration du router front (history mémoire car app desktop)
import { createRouter, createMemoryHistory } from "vue-router";

import TableauDeBord from "./pages/TableauDeBord.vue";
import Membres from "./pages/Membres.vue";
import Terrains from "./pages/Terrains.vue";
import Reservations from "./pages/Reservations.vue";
import Cours from "./pages/Cours.vue";
import Adhesions from "./pages/Adhesions.vue";
import Adresses from "./pages/Adresses.vue";
import Paiements from "./pages/Paiements.vue";
import Participations from "./pages/Participations.vue";
import Animations from "./pages/Animations.vue";

const routes = [
  { path: "/", component: TableauDeBord },
  { path: "/membres", component: Membres },
  { path: "/terrains", component: Terrains },
  { path: "/reservations", component: Reservations },
  { path: "/cours", component: Cours },
  { path: "/adhesions", component: Adhesions },
  { path: "/adresses", component: Adresses },
  { path: "/paiements", component: Paiements },
  { path: "/participations", component: Participations },
  { path: "/animations", component: Animations },
];

export const router = createRouter({ routes, history: createMemoryHistory() });
