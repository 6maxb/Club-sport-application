// Représentation d'une adresse postale de membre
export default interface Adresse {
  id?: number;
  rue: string;
  codePostal: string;
  ville: string;
  pays: string;
}