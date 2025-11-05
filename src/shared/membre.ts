// Structure de base d'un membre partagée entre toutes les couches
export default interface Membre {
  id?: number;
  adresseId: number;
  nom: string;
  prenom: string;
  dateNaissance: Date;
  email: string;
  telephone?: string;
  estEntraineur: boolean;
  specialite?: string;
  estActif: boolean;
}
