export interface TestimonialModel {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  created?: string;
  updated?: string;

  name: string;
  role?: string;
  company?: string;
  message: string;
  avatar?: string;

  featured?: boolean;
  status?: 'borrador' | 'publicado';
  orderIndex?: number;
}