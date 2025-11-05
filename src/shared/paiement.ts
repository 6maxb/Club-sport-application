// Format des paiements enregistrés (lien adhésion/réservation/cours)
export default interface Paiement {
  id?: number;
  adhesionId?: number;
  reservationId?: number;
  coursId?: number;
  montant: number;
  datePaiement: Date;
  typePaiement?: string;
  modePaiement?: string;
}
