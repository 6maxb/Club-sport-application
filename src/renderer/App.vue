<!-- Layout principal : sidebar navigation + vue courante -->
<template>
  <div class="layout">
    <aside class="sidebar">
      <h1>Club de tennis</h1>
      <nav>
        <RouterLink to="/">Tableau de bord</RouterLink>
        <RouterLink to="/membres">Membres</RouterLink>
        <RouterLink to="/terrains">Terrains</RouterLink>
        <RouterLink to="/reservations">Réservations</RouterLink>
        <RouterLink to="/cours">Cours</RouterLink>
        <RouterLink to="/adhesions">Adhésions</RouterLink>
        <RouterLink to="/paiements">Paiements</RouterLink>
        <RouterLink to="/participations">Participations</RouterLink>
        <RouterLink to="/animations">Animations</RouterLink>
      </nav>
    </aside>
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #0f172a;
  color: #f8fafc;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sidebar h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

nav a {
  color: inherit;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: background 0.2s ease;
}

nav a.router-link-active {
  background: rgba(148, 163, 184, 0.2);
}

.content {
  background: #0f172a;
  color: #e2e8f0;
  padding: 2rem;
}
</style>
