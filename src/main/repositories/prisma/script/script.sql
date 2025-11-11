-- Script d'initialisation pour le club de tennis
-- 0) Choisir la même base que l’application (.env -> gestion_club)
USE gestion_club;

-- 1) Insérer d’abord les “parents” (pas de dépendances)
-- INSERT IGNORE évite l’erreur si la ligne existe déjà (duplication).
INSERT IGNORE INTO Adresse (Rue, Code_postal, Ville, Pays) VALUES
('12 avenue des Sports', '75012', 'Paris', 'France'),
('5 rue des Tilleuls', '69003', 'Lyon', 'France');

INSERT IGNORE INTO Terrain (Nom, Surface, Couvert, Eclairage, Localisation) VALUES
('Court central', 648, 0, 1, 'Complexe principal'),
('Court couvert 1', 600, 1, 1, 'Bâtiment couvert');

-- 2) Insérer les “enfants” Membre
-- Au lieu de deviner l’ID_adresse (qui dépend de l’AUTO_INCREMENT),
-- on récupère l’ID depuis la table Adresse (SELECT) pour ne jamais casser la FK.
INSERT IGNORE INTO Membre
(ID_adresse, Nom, Prenom, Date_naissance, Email, Telephone, Est_entraineur, Specialite, Est_actif)
SELECT a.ID_adresse, 'Dupont', 'Claire', '1990-03-12', 'claire.dupont@example.com', '0601020304', 0, NULL, 1
FROM Adresse a
WHERE a.Rue='12 avenue des Sports' AND a.Code_postal='75012';

INSERT IGNORE INTO Membre
(ID_adresse, Nom, Prenom, Date_naissance, Email, Telephone, Est_entraineur, Specialite, Est_actif)
SELECT a.ID_adresse, 'Martin', 'Louis', '1985-07-24', 'louis.martin@example.com', '0605060708', 1, 'Performance', 1
FROM Adresse a
WHERE a.Rue='5 rue des Tilleuls' AND a.Code_postal='69003';

-- 3) Adhésions liées aux membres
-- On retrouve l’ID_membre via l’email (unique) pour ne pas dépendre d’un ID connu.
INSERT IGNORE INTO Adhesions (ID_membre, Type_adhesion, Date_debut, Date_fin)
SELECT m.ID_membre, 'Annuel', '2025-01-01', '2025-12-31' FROM Membre m WHERE m.Email='claire.dupont@example.com';

INSERT IGNORE INTO Adhesions (ID_membre, Type_adhesion, Date_debut, Date_fin)
SELECT m.ID_membre, 'Semestre','2025-01-01', '2025-06-30' FROM Membre m WHERE m.Email='louis.martin@example.com';

-- 4) Cours liés aux terrains
INSERT IGNORE INTO Cours (ID_terrain, Titre, Niveau, Date_heure, Duree, Capacite)
SELECT t.ID_terrain, 'Cours perfectionnement', 'Avancé', '2025-02-05 18:00:00', 90, 8
FROM Terrain t WHERE t.Nom='Court central';

INSERT IGNORE INTO Cours (ID_terrain, Titre, Niveau, Date_heure, Duree, Capacite)
SELECT t.ID_terrain, 'Initiation jeunes', 'Débutant', '2025-02-06 14:00:00', 60, 12
FROM Terrain t WHERE t.Nom='Court couvert 1';

-- 5) Réservations liées aux membres et aux terrains
-- On join pour récupérer à la fois ID_membre et ID_terrain sans connaître leurs IDs.
INSERT IGNORE INTO Reservation (ID_membre, ID_terrain, Date_reservation, Heure_debut, Heure_fin, Statut)
SELECT m.ID_membre, t.ID_terrain, '2025-02-10', '10:00:00', '11:30:00', 'Confirmée'
FROM Membre m
JOIN Terrain t ON t.Nom='Court central'
WHERE m.Email='claire.dupont@example.com';

INSERT IGNORE INTO Reservation (ID_membre, ID_terrain, Date_reservation, Heure_debut, Heure_fin, Statut)
SELECT m.ID_membre, t.ID_terrain, '2025-02-11', '16:00:00', '17:30:00', 'Confirmée'
FROM Membre m
JOIN Terrain t ON t.Nom='Court couvert 1'
WHERE m.Email='louis.martin@example.com';