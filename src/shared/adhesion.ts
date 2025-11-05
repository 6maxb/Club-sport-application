// Données d'adhésion (type et période de validité)
export default interface Adhesion {
  id?: number;
  membreId: number;
  type: string;
  dateDebut: Date;
  dateFin: Date;
}
