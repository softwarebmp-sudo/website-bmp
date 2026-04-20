export interface PortfolioModel {
  id?: string;
  name: string;
  slug?: string;
  location: string;
  type: string;
  category: string;
  description: string;
  clientProblem?: string;
  implementedSolution?: string;
  result?: string;
  gallery?: string[];
  cover?: string;
  featured?: boolean;
  status: 'borrador' | 'publicado';
  orderIndex?: number;
  year?: number;
  created?: string;
  updated?: string;
}