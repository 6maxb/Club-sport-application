// Décrit les informations d'un terrain de jeu
export default interface Terrain {
  id?: number;
  nom: string;
  surface?: number;
  couvert: boolean;
  eclairage: boolean;
  localisation?: string;
}