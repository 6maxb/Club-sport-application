// Liaison entre un entraîneur et un cours (animation)
export default interface Anime {
  membreId: number;
  coursId: number;
  role: string;
  remuneration?: number;
}
