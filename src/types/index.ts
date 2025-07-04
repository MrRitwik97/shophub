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
  addedAt: Date;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface PaymentMethod {
  id?: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod';
  card?: {
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
  };
  upi?: {
    vpa: string;
  };
  isDefault?: boolean;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface Order {
  id: string;
  userId: string;
  items: (CartItem & { product: Product; price: number })[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  totalAmount: number;
  orderNumber: string;
  estimatedDelivery?: Date;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Filter {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export type SortOption = 'name' | 'price-low' | 'price-high' | 'newest';