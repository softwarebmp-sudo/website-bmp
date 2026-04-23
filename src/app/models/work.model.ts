export interface WorkModel {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  created?: string;
  updated?: string;

  projectName: string;
  description: string;
  photos?: string[];

  location?: string;
  category?: string;

  featured?: boolean;
  status?: 'borrador' | 'publicado';
  orderIndex?: number;
}