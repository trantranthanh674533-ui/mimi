export type Language = 'en' | 'zh';

export interface BreedStats {
  friendliness: number;
  energy: number;
  grooming: number;
  intelligence: number;
  vocalisation: number;
}

export interface BreedDetails {
  name: string;
  description: string;
  origin: string;
  lifeSpan: string;
  weight: string;
  temperament: string[];
  stats: BreedStats;
  funFact: string;
}

// 3-Level Hierarchy
// Level 3: Breed
export interface BreedMenuItem {
  id: string;
  name: string;
  type: 'breed';
}

// Level 2: Subcategory (e.g., Coat Type)
export interface SubCategory {
  id: string;
  name: string;
  type: 'subcategory';
  children: BreedMenuItem[];
}

// Level 1: Category (e.g., Region/Origin)
export interface Category {
  id: string;
  name: string;
  type: 'category';
  children: SubCategory[];
}

export type LoadingState = 'idle' | 'loading-tree' | 'loading-breed' | 'error';