-- Script d'initialisation pour le club de tennis

--CREATE DATABASE club_tennis;

USE club_tennis;

INSERT INTO Adresse (Rue, Code_postal, Ville, Pays)
VALUES
  ('12 avenue des Sports', '75012', 'Paris', 'France'),
  ('5 rue des Tilleuls', '69003', 'Lyon', 'France');

INSERT INTO Terrain (Nom, Surface, Couvert, Eclairage, Localisation)
VALUES
  ('Court central', 648, false, true, 'Complexe principal'),
  ('Court couvert 1', 600, true, true, 'Bâtiment couvert');

INSERT INTO Membre (ID_adresse, Nom, Prenom, Date_naissance, Email, Telephone, Est_entraineur, Specialite, Est_actif)
VALUES
  (1, 'Dupont', 'Claire', '1990-03-12', 'claire.dupont@example.com', '0601020304', false, NULL, true),
  (2, 'Martin', 'Louis', '1985-07-24', 'louis.martin@example.com', '0605060708', true, 'Performance', true);

INSERT INTO Adhesions (ID_membre, Type_adhesion, Date_debut, Date_fin)
VALUES
  (1, 'Annuel', '2025-01-01', '2025-12-31'),
  (2, 'Semestre', '2025-01-01', '2025-06-30');

INSERT INTO Cours (ID_terrain, Titre, Niveau, Date_heure, Duree, Capacite)
VALUES
  (1, 'Cours perfectionnement', 'Avancé', '2025-02-05 18:00:00', 90, 8),
  (2, 'Initiation jeunes', 'Débutant', '2025-02-06 14:00:00', 60, 12);

INSERT INTO Reservation (ID_membre, ID_terrain, Date_reservation, Heure_debut, Heure_fin, Statut)
VALUES
  (1, 1, '2025-02-10', '10:00:00', '11:30:00', 'Confirmée'),
  (2, 2, '2025-02-11', '16:00:00', '17:30:00', 'Confirmée');
