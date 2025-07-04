import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { 
  CustomerProfile, 
  CustomerAddress, 
  WishlistItem, 
  CustomerPreferences,
  ProfileUpdateRequest,
  SecurityUpdateRequest,
  OrderHistoryFilter,
  LoyaltyProgram,
  CustomerActivity
} from '../types/profile';
import { Order, Product } from '../types';
import { User } from '../types/auth';
import { useEcommerce } from './EcommerceContext';

interface ProfileContextType {
  // Profile State
  customerProfile: CustomerProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Profile Management
  updateProfile: (updates: ProfileUpdateRequest) => Promise<void>;
  updateSecurity: (updates: SecurityUpdateRequest) => Promise<void>;
  calculateProfileCompletion: () => number;
  
  // Address Management
  addresses: CustomerAddress[];
  addAddress: (address: Omit<CustomerAddress, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAddress: (id: string, updates: Partial<CustomerAddress>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string, type: 'shipping' | 'billing') => Promise<void>;
  
  // Wishlist Management
  wishlistItems: WishlistItem[];
  addToWishlist: (product: Product, notes?: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  toggleWishlistNotification: (productId: string) => Promise<void>;
  
  // Order History
  orderHistory: Order[];
  filteredOrders: Order[];
  filterOrders: (filter: OrderHistoryFilter) => void;
  reorderItems: (orderId: string) => Promise<void>;
  downloadInvoice: (orderId: string) => Promise<void>;
  
  // Loyalty Program
  loyaltyProgram: LoyaltyProgram | null;
  refreshLoyaltyData: () => Promise<void>;
  
  // Activity & Analytics
  recentActivity: CustomerActivity[];
  getActivityHistory: (limit?: number) => Promise<CustomerActivity[]>;
  
  // Preferences
  updatePreferences: (preferences: Partial<CustomerPreferences>) => Promise<void>;
  
  // Data Management
  exportCustomerData: () => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

const MOCK_PREFERENCES: CustomerPreferences = {
  emailNotifications: {
    orderUpdates: true,
    promotions: true,
    newProducts: false,
    priceDrops: true,
    backInStock: true,
  },
  smsNotifications: {
    orderUpdates: true,
    deliveryUpdates: true,
  },
  privacy: {
    profileVisibility: 'private',
    allowDataCollection: true,
    allowThirdPartySharing: false,
  },
  shopping: {
    defaultCurrency: 'INR',
    preferredLanguage: 'en',
    theme: 'light',
    itemsPerPage: 12,
  },
};

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { products } = useEcommerce();
  
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loyaltyProgram, setLoyaltyProgram] = useState<LoyaltyProgram | null>(null);
  const [recentActivity, setRecentActivity] = useState<CustomerActivity[]>([]);

  // Initialize profile when user logs in
  useEffect(() => {
    if (isAuthenticated && user && user.role === 'customer') {
      initializeProfile();
    } else {
      resetProfile();
    }
  }, [isAuthenticated, user]);

  const initializeProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Load from localStorage or create new profile
      const savedProfile = localStorage.getItem(`profile_${user.id}`);
      const savedAddresses = localStorage.getItem(`addresses_${user.id}`);
      const savedWishlist = localStorage.getItem(`wishlist_${user.id}`);
      const savedOrders = localStorage.getItem(`orders_${user.id}`);

      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setCustomerProfile(profile);
      } else {
        // Create new customer profile
        const newProfile: CustomerProfile = {
          ...user,
          addresses: [],
          orderHistory: [],
          wishlist: [],
          loyaltyPoints: 0,
          totalSpent: 0,
          lastActive: new Date(),
          accountStatus: 'active',
          profileCompletion: calculateInitialProfileCompletion(user),
          joinedDate: user.createdAt,
          averageOrderValue: 0,
          orderCount: 0,
          preferences: { ...MOCK_PREFERENCES }
        };
        setCustomerProfile(newProfile);
        saveProfile(newProfile);
      }

      // Load addresses
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      }

      // Load wishlist
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }

      // Load orders
      if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        setOrderHistory(orders);
        setFilteredOrders(orders);
      }

      // Initialize loyalty program
      initializeLoyaltyProgram();
      
      // Load recent activity
      loadRecentActivity();

    } catch (error) {
      setError('Failed to load profile');
      console.error('Profile initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetProfile = () => {
    setCustomerProfile(null);
    setAddresses([]);
    setWishlistItems([]);
    setOrderHistory([]);
    setFilteredOrders([]);
    setLoyaltyProgram(null);
    setRecentActivity([]);
    setError(null);
  };

  const calculateInitialProfileCompletion = (user: any): number => {
    let completion = 40; // Base for having account
    if (user.firstName && user.lastName) completion += 20;
    if (user.phoneNumber) completion += 20;
    if (user.email) completion += 20;
    return completion;
  };

  const calculateProfileCompletion = (): number => {
    if (!customerProfile) return 0;
    
    let completion = 0;
    
    // Basic info (40%)
    if (customerProfile.firstName && customerProfile.lastName) completion += 20;
    if (customerProfile.email) completion += 10;
    if (customerProfile.phoneNumber) completion += 10;
    
    // Addresses (20%)
    if (addresses.length > 0) completion += 20;
    
    // Order history (20%)
    if (orderHistory.length > 0) completion += 20;
    
    // Preferences (20%)
    if (customerProfile.preferences) completion += 20;
    
    return Math.min(completion, 100);
  };

  const saveProfile = (profile: CustomerProfile) => {
    if (!user) return;
    localStorage.setItem(`profile_${user.id}`, JSON.stringify(profile));
  };

  const saveAddresses = (addresses: CustomerAddress[]) => {
    if (!user) return;
    localStorage.setItem(`addresses_${user.id}`, JSON.stringify(addresses));
  };

  const saveWishlist = (wishlist: WishlistItem[]) => {
    if (!user) return;
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist));
  };

  const updateProfile = async (updates: ProfileUpdateRequest): Promise<void> => {
    if (!customerProfile || !user) throw new Error('No profile to update');

    try {
      const updatedProfile = {
        ...customerProfile,
        ...updates,
        updatedAt: new Date(),
        profileCompletion: calculateProfileCompletion()
      };

      setCustomerProfile(updatedProfile);
      saveProfile(updatedProfile);
      
      // Log activity
      logActivity('profile_update', 'Profile information updated');
      
    } catch (error) {
      setError('Failed to update profile');
      throw error;
    }
  };

  const updateSecurity = async (updates: SecurityUpdateRequest): Promise<void> => {
    if (!user) throw new Error('No user logged in');

    try {
      // In real app, this would call backend API
      // For now, just log the activity
      logActivity('password_change', 'Security settings updated');
      
    } catch (error) {
      setError('Failed to update security settings');
      throw error;
    }
  };

  // Address Management
  const addAddress = async (addressData: Omit<CustomerAddress, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    const newAddress: CustomerAddress = {
      ...addressData,
      id: `addr_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses);
    saveAddresses(updatedAddresses);
    
    logActivity('address_add', `Added new address: ${addressData.label}`);
  };

  const updateAddress = async (id: string, updates: Partial<CustomerAddress>): Promise<void> => {
    const updatedAddresses = addresses.map(addr => 
      addr.id === id ? { ...addr, ...updates, updatedAt: new Date() } : addr
    );
    setAddresses(updatedAddresses);
    saveAddresses(updatedAddresses);
  };

  const deleteAddress = async (id: string): Promise<void> => {
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    setAddresses(updatedAddresses);
    saveAddresses(updatedAddresses);
  };

  const setDefaultAddress = async (id: string, type: 'shipping' | 'billing'): Promise<void> => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      [type === 'shipping' ? 'isShipping' : 'isBilling']: addr.id === id,
      updatedAt: new Date()
    }));
    setAddresses(updatedAddresses);
    saveAddresses(updatedAddresses);
  };

  // Wishlist Management
  const addToWishlist = async (product: Product, notes?: string): Promise<void> => {
    const existingItem = wishlistItems.find(item => item.productId === product.id);
    if (existingItem) return; // Already in wishlist

    const wishlistItem: WishlistItem = {
      id: `wish_${Date.now()}`,
      productId: product.id,
      addedAt: new Date(),
      notes,
      priceWhenAdded: product.discountedPrice || product.regularPrice,
      notifyOnSale: false
    };

    const updatedWishlist = [...wishlistItems, wishlistItem];
    setWishlistItems(updatedWishlist);
    saveWishlist(updatedWishlist);
    
    logActivity('wishlist_add', `Added ${product.name} to wishlist`);
  };

  const removeFromWishlist = async (productId: string): Promise<void> => {
    const updatedWishlist = wishlistItems.filter(item => item.productId !== productId);
    setWishlistItems(updatedWishlist);
    saveWishlist(updatedWishlist);
  };

  const clearWishlist = async (): Promise<void> => {
    setWishlistItems([]);
    saveWishlist([]);
  };

  const toggleWishlistNotification = async (productId: string): Promise<void> => {
    const updatedWishlist = wishlistItems.map(item =>
      item.productId === productId
        ? { ...item, notifyOnSale: !item.notifyOnSale }
        : item
    );
    setWishlistItems(updatedWishlist);
    saveWishlist(updatedWishlist);
  };

  // Order Management
  const filterOrders = (filter: OrderHistoryFilter) => {
    let filtered = [...orderHistory];

    if (filter.status) {
      filtered = filtered.filter(order => order.status === filter.status);
    }

    if (filter.dateFrom) {
      filtered = filtered.filter(order => order.createdAt >= filter.dateFrom!);
    }

    if (filter.dateTo) {
      filtered = filtered.filter(order => order.createdAt <= filter.dateTo!);
    }

    if (filter.minAmount) {
      filtered = filtered.filter(order => order.totalAmount >= filter.minAmount!);
    }

    if (filter.maxAmount) {
      filtered = filtered.filter(order => order.totalAmount <= filter.maxAmount!);
    }

    // Sorting
    filtered.sort((a, b) => {
      const aValue = filter.sortBy === 'date' ? a.createdAt.getTime() : a.totalAmount;
      const bValue = filter.sortBy === 'date' ? b.createdAt.getTime() : b.totalAmount;
      
      return filter.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });

    setFilteredOrders(filtered);
  };

  const reorderItems = async (orderId: string): Promise<void> => {
    // In real app, this would add items to cart
    const order = orderHistory.find(o => o.id === orderId);
    if (order) {
      logActivity('order', `Reordered items from order ${order.orderNumber}`);
    }
  };

  const downloadInvoice = async (orderId: string): Promise<void> => {
    // In real app, this would generate and download PDF
    console.log(`Downloading invoice for order ${orderId}`);
  };

  // Loyalty Program
  const initializeLoyaltyProgram = () => {
    const totalSpent = customerProfile?.totalSpent || 0;
    const orderCount = customerProfile?.orderCount || 0;
    
    let tier: 'bronze' | 'silver' | 'gold' | 'platinum' = 'bronze';
    let currentPoints = Math.floor(totalSpent / 100); // 1 point per ₹100
    
    if (totalSpent >= 100000) tier = 'platinum';
    else if (totalSpent >= 50000) tier = 'gold';
    else if (totalSpent >= 20000) tier = 'silver';
    
    const nextTierPoints = {
      bronze: 200,
      silver: 500,
      gold: 1000,
      platinum: 0
    };

    setLoyaltyProgram({
      currentPoints,
      totalEarned: currentPoints,
      totalRedeemed: 0,
      tier,
      nextTierPoints: nextTierPoints[tier],
      pointsToNextTier: Math.max(0, nextTierPoints[tier] - currentPoints),
      expiringPoints: []
    });
  };

  const refreshLoyaltyData = async (): Promise<void> => {
    initializeLoyaltyProgram();
  };

  // Activity Management
  const logActivity = (type: CustomerActivity['type'], description: string) => {
    if (!user) return;

    const activity: CustomerActivity = {
      id: `activity_${Date.now()}`,
      customerId: user.id,
      type,
      description,
      timestamp: new Date(),
      ipAddress: '127.0.0.1', // In real app, get actual IP
      userAgent: navigator.userAgent
    };

    const updatedActivity = [activity, ...recentActivity].slice(0, 50); // Keep last 50
    setRecentActivity(updatedActivity);
    
    if (user) {
      localStorage.setItem(`activity_${user.id}`, JSON.stringify(updatedActivity));
    }
  };

  const loadRecentActivity = () => {
    if (!user) return;
    
    const savedActivity = localStorage.getItem(`activity_${user.id}`);
    if (savedActivity) {
      setRecentActivity(JSON.parse(savedActivity));
    }
  };

  const getActivityHistory = async (limit = 50): Promise<CustomerActivity[]> => {
    return recentActivity.slice(0, limit);
  };

  // Preferences
  const updatePreferences = async (preferences: Partial<CustomerPreferences>): Promise<void> => {
    if (!customerProfile) throw new Error('No profile to update');

    const updatedProfile = {
      ...customerProfile,
      preferences: {
        ...customerProfile.preferences,
        ...preferences
      }
    };

    setCustomerProfile(updatedProfile);
    saveProfile(updatedProfile);
  };

  // Data Management
  const exportCustomerData = async (): Promise<void> => {
    if (!customerProfile) return;

    const data = {
      profile: customerProfile,
      addresses,
      wishlist: wishlistItems,
      orders: orderHistory,
      activity: recentActivity,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shophub-data-${user?.email}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteAccount = async (password: string): Promise<void> => {
    if (!user) throw new Error('No user logged in');

    // In real app, verify password and delete from backend
    // For now, just clear local data
    localStorage.removeItem(`profile_${user.id}`);
    localStorage.removeItem(`addresses_${user.id}`);
    localStorage.removeItem(`wishlist_${user.id}`);
    localStorage.removeItem(`orders_${user.id}`);
    localStorage.removeItem(`activity_${user.id}`);
    
    resetProfile();
  };

  const refreshProfile = async (): Promise<void> => {
    await initializeProfile();
  };

  const value: ProfileContextType = {
    customerProfile,
    isLoading,
    error,
    updateProfile,
    updateSecurity,
    calculateProfileCompletion,
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    toggleWishlistNotification,
    orderHistory,
    filteredOrders,
    filterOrders,
    reorderItems,
    downloadInvoice,
    loyaltyProgram,
    refreshLoyaltyData,
    recentActivity,
    getActivityHistory,
    updatePreferences,
    exportCustomerData,
    deleteAccount,
    refreshProfile
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};