export interface BlogModel {
  id?: string;
  title: string;
  category?: string;
  excerpt?: string;
  content?: string;
  cover?: string[];
  published?: boolean;
  slug?: string;
  publishDate?: string;
  created?: string;
  updated?: string;
}