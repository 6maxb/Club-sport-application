// Liaison entre un membre et un cours (participation)
export default interface Participe {
  membreId: number;
  coursId: number;
  statut: string;
  dateInscription: Date;
}
