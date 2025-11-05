// Structure commune pour les réservations (utilisée main/preload/vue)
export default interface Reservation {
  id?: number;
  membreId: number;
  terrainId: number;
  dateReservation: Date;
  heureDebut: string; // format HH:mm:ss ou ISO time
  heureFin: string;
  statut: string;
  dateCreation?: Date;
}
