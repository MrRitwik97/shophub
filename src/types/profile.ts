import { User, AdminUser } from './auth';
import { Order } from './index';

// Customer Profile Extensions
export interface CustomerProfile extends User {
  addresses: CustomerAddress[];
  orderHistory: Order[];
  wishlist: string[]; // Product IDs
  loyaltyPoints: number;
  totalSpent: number;
  lastActive: Date;
  accountStatus: 'active' | 'suspended' | 'pending';
  profileCompletion: number; // Percentage 0-100
  joinedDate: Date;
  averageOrderValue: number;
  orderCount: number;
}

// Enhanced Address with more fields
export interface CustomerAddress {
  id: string;
  label: string; // "Home", "Work", "Other"
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
  isDefault: boolean;
  isShipping: boolean;
  isBilling: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Wishlist Item with additional info
export interface WishlistItem {
  id: string;
  productId: string;
  addedAt: Date;
  notes?: string;
  priceWhenAdded: number;
  notifyOnSale: boolean;
}

// Customer Preferences
export interface CustomerPreferences {
  emailNotifications: {
    orderUpdates: boolean;
    promotions: boolean;
    newProducts: boolean;
    priceDrops: boolean;
    backInStock: boolean;
  };
  smsNotifications: {
    orderUpdates: boolean;
    deliveryUpdates: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    allowDataCollection: boolean;
    allowThirdPartySharing: boolean;
  };
  shopping: {
    defaultCurrency: string;
    preferredLanguage: string;
    theme: 'light' | 'dark' | 'auto';
    itemsPerPage: number;
  };
}

// Admin Customer Management Types
export interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  joinedDate: Date;
  lastActive: Date;
  orderCount: number;
  totalSpent: number;
  status: 'active' | 'suspended' | 'pending';
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface CustomerAnalytics {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  newCustomersThisWeek: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
  retentionRate: number;
  churnRate: number;
  topCustomers: CustomerSummary[];
  customerGrowth: ChartDataPoint[];
  geographicDistribution: GeographicData[];
  customerSegments: CustomerSegment[];
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface GeographicData {
  state: string;
  customerCount: number;
  revenue: number;
}

export interface CustomerSegment {
  name: string;
  count: number;
  percentage: number;
  averageSpent: number;
  description: string;
}

// Customer Activity & Communication
export interface CustomerActivity {
  id: string;
  customerId: string;
  type: 'login' | 'order' | 'profile_update' | 'password_change' | 'address_add' | 'wishlist_add';
  description: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface CustomerNote {
  id: string;
  customerId: string;
  adminId: string;
  note: string;
  type: 'general' | 'support' | 'billing' | 'shipping';
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Customer Search & Filter Types
export interface CustomerSearchParams {
  query?: string;
  status?: 'active' | 'suspended' | 'pending' | 'all';
  joinedAfter?: Date;
  joinedBefore?: Date;
  orderCountMin?: number;
  orderCountMax?: number;
  totalSpentMin?: number;
  totalSpentMax?: number;
  lastActiveAfter?: Date;
  lastActiveBefore?: Date;
  loyaltyTier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'all';
  sortBy?: 'name' | 'joinedDate' | 'lastActive' | 'orderCount' | 'totalSpent';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CustomerSearchResult {
  customers: CustomerSummary[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

// Profile Update Types
export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  preferences?: Partial<CustomerPreferences>;
}

export interface SecurityUpdateRequest {
  currentPassword: string;
  newPassword?: string;
  enableTwoFactor?: boolean;
  trustedDevices?: string[];
}

// Order History Enhancement
export interface OrderHistoryFilter {
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: 'date' | 'amount' | 'status';
  sortOrder?: 'asc' | 'desc';
}

// Loyalty System Types
export interface LoyaltyProgram {
  currentPoints: number;
  totalEarned: number;
  totalRedeemed: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  nextTierPoints: number;
  pointsToNextTier: number;
  expiringPoints: {
    points: number;
    expiryDate: Date;
  }[];
}

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  type: 'earned' | 'redeemed' | 'expired';
  points: number;
  description: string;
  orderId?: string;
  createdAt: Date;
  expiresAt?: Date;
}

// Customer Support Types
export interface SupportTicket {
  id: string;
  customerId: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'order' | 'product' | 'billing' | 'technical' | 'general';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  responses: SupportResponse[];
}

export interface SupportResponse {
  id: string;
  ticketId: string;
  authorId: string;
  authorType: 'customer' | 'admin';
  message: string;
  attachments?: string[];
  createdAt: Date;
}

// All types are exported above with their declarations