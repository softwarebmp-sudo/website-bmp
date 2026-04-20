export interface ServiceModel {
  id?: string;
  name: string;
  slug?: string;
  description: string;
  benefits?: string;
  useCases?: string;
  cover?: string;
  gallery?: string[];
  featured?: boolean;
  status: 'borrador' | 'publicado';
  orderIndex?: number;
  created?: string;
  updated?: string;
}