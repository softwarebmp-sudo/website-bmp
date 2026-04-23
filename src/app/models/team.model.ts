export interface TeamModel {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  created?: string;
  updated?: string;

  name: string;
  role?: string;
  bio?: string;
  image?: string;

  featured?: boolean;
  status?: 'borrador' | 'publicado';
  orderIndex?: number;

  linkedin?: string;
  instagram?: string;
  email?: string;
}