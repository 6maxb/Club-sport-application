// Propriétés principales d'un cours de tennis
export default interface Cours {
  id?: number;
  terrainId: number;
  titre: string;
  niveau: string;
  dateHeure: Date;
  duree: number;
  capacite: number;
}
