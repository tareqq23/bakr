export type MenuCategory = 'semua' | 'burger' | 'rice-pasta';

export interface BurgerMenuItem {
  id: string;
  name: string;
  category: Exclude<MenuCategory, 'semua'>;
  price: number;
  weightInfo: string;
  spiceInfo: string;
  bunInfo: string;
  description: string;
  image: string;
  featuredSpan?: boolean;
  highlightNote?: string;
  isLimitedTime?: boolean;
}

export interface CartItem {
  cartKey: string;
  title: string;
  unitPrice: number;
  quantity: number;
  image?: string;
}

export interface FaqItem {
  id: string;
  topic: string;
  question: string;
  answer: string;
}

