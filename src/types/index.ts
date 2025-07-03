export interface Product {
  id: string;
  name: string;
  images: string[];
  regularPrice: number;
  discountedPrice?: number;
  category: string;
  subcategory?: string;
  description: string;
  stock: number;
  featured: boolean;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories?: Category[];
  parentId?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Filter {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export type SortOption = 'name' | 'price-low' | 'price-high' | 'newest';