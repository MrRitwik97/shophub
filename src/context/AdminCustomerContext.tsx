import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CustomerSummary, 
  CustomerAnalytics, 
  CustomerSearchParams, 
  CustomerSearchResult,
  CustomerNote,
  CustomerActivity,
  GeographicData,
  CustomerSegment
} from '../types/profile';

interface AdminCustomerContextType {
  // Customer Data
  customers: CustomerSummary[];
  selectedCustomer: CustomerSummary | null;
  searchResults: CustomerSearchResult | null;
  isLoading: boolean;
  error: string | null;

  // Analytics
  analytics: CustomerAnalytics | null;
  refreshAnalytics: () => Promise<void>;

  // Customer Management
  searchCustomers: (params: CustomerSearchParams) => Promise<void>;
  getCustomerDetails: (customerId: string) => Promise<CustomerSummary | null>;
  updateCustomerStatus: (customerId: string, status: 'active' | 'suspended' | 'pending') => Promise<void>;
  deleteCustomer: (customerId: string) => Promise<void>;

  // Notes & Communication
  customerNotes: CustomerNote[];
  addCustomerNote: (customerId: string, note: string, type: CustomerNote['type'], isPrivate: boolean) => Promise<void>;
  updateCustomerNote: (noteId: string, updates: Partial<CustomerNote>) => Promise<void>;
  deleteCustomerNote: (noteId: string) => Promise<void>;

  // Activity Tracking
  customerActivities: CustomerActivity[];
  getCustomerActivity: (customerId: string, limit?: number) => Promise<CustomerActivity[]>;

  // Bulk Operations
  bulkUpdateCustomers: (customerIds: string[], updates: Partial<CustomerSummary>) => Promise<void>;
  exportCustomersData: (customerIds?: string[]) => Promise<void>;

  // Filters & Selection
  selectedCustomerIds: string[];
  toggleCustomerSelection: (customerId: string) => void;
  selectAllCustomers: () => void;
  clearSelection: () => void;

  // View Management
  currentView: 'list' | 'analytics' | 'details';
  setCurrentView: (view: 'list' | 'analytics' | 'details') => void;
}

const AdminCustomerContext = createContext<AdminCustomerContextType | undefined>(undefined);

export const useAdminCustomers = () => {
  const context = useContext(AdminCustomerContext);
  if (!context) {
    throw new Error('useAdminCustomers must be used within an AdminCustomerProvider');
  }
  return context;
};

// Mock data generators
const generateMockCustomers = (count: number): CustomerSummary[] => {
  const names = [
    'Aarav Sharma', 'Vivaan Patel', 'Aditya Kumar', 'Vihaan Singh', 'Arjun Gupta',
    'Sai Reddy', 'Reyansh Agarwal', 'Ayaan Khan', 'Krishna Joshi', 'Ishaan Yadav',
    'Priya Sharma', 'Ananya Patel', 'Diya Kumar', 'Aarohi Singh', 'Kavya Gupta',
    'Saanvi Reddy', 'Aahana Agarwal', 'Myra Khan', 'Pari Joshi', 'Aditi Yadav'
  ];

  const emails = names.map(name => `${name.toLowerCase().replace(' ', '.')}@example.com`);
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad'];
  const tiers = ['bronze', 'silver', 'gold', 'platinum'] as const;
  const statuses = ['active', 'suspended', 'pending'] as const;

  return Array.from({ length: count }, (_, i) => ({
    id: `customer_${i + 1}`,
    name: names[i % names.length],
    email: emails[i % emails.length],
    joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    orderCount: Math.floor(Math.random() * 50) + 1,
    totalSpent: Math.floor(Math.random() * 100000) + 1000,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    loyaltyTier: tiers[Math.floor(Math.random() * tiers.length)]
  }));
};

const generateMockAnalytics = (customers: CustomerSummary[]): CustomerAnalytics => {
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const thisMonth = new Date();
  const lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1, 1);
  
  const newCustomersThisMonth = customers.filter(c => c.joinedDate >= lastMonth).length;
  const newCustomersThisWeek = customers.filter(c => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return c.joinedDate >= weekAgo;
  }).length;

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.orderCount, 0);
  const customerLifetimeValue = totalRevenue / totalCustomers;

  const topCustomers = customers
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10);

  const customerGrowth = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      value: Math.floor(Math.random() * 100) + 50,
    };
  }).reverse();

  const geographicDistribution: GeographicData[] = [
    { state: 'Maharashtra', customerCount: Math.floor(totalCustomers * 0.2), revenue: totalRevenue * 0.25 },
    { state: 'Karnataka', customerCount: Math.floor(totalCustomers * 0.15), revenue: totalRevenue * 0.2 },
    { state: 'Delhi', customerCount: Math.floor(totalCustomers * 0.12), revenue: totalRevenue * 0.18 },
    { state: 'Tamil Nadu', customerCount: Math.floor(totalCustomers * 0.1), revenue: totalRevenue * 0.12 },
    { state: 'Others', customerCount: Math.floor(totalCustomers * 0.43), revenue: totalRevenue * 0.25 },
  ];

  const customerSegments: CustomerSegment[] = [
    { name: 'VIP Customers', count: Math.floor(totalCustomers * 0.05), percentage: 5, averageSpent: 50000, description: 'High-value customers' },
    { name: 'Regular Customers', count: Math.floor(totalCustomers * 0.3), percentage: 30, averageSpent: 15000, description: 'Frequent buyers' },
    { name: 'Occasional Buyers', count: Math.floor(totalCustomers * 0.45), percentage: 45, averageSpent: 5000, description: 'Infrequent purchases' },
    { name: 'New Customers', count: Math.floor(totalCustomers * 0.2), percentage: 20, averageSpent: 2000, description: 'Recently joined' },
  ];

  return {
    totalCustomers,
    activeCustomers,
    newCustomersThisMonth,
    newCustomersThisWeek,
    averageOrderValue,
    customerLifetimeValue,
    retentionRate: 0.75,
    churnRate: 0.25,
    topCustomers,
    customerGrowth,
    geographicDistribution,
    customerSegments,
  };
};

export const AdminCustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSummary | null>(null);
  const [searchResults, setSearchResults] = useState<CustomerSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<CustomerAnalytics | null>(null);
  const [customerNotes, setCustomerNotes] = useState<CustomerNote[]>([]);
  const [customerActivities, setCustomerActivities] = useState<CustomerActivity[]>([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'analytics' | 'details'>('list');

  // Initialize with mock data
  useEffect(() => {
    const mockCustomers = generateMockCustomers(50);
    setCustomers(mockCustomers);
    setAnalytics(generateMockAnalytics(mockCustomers));
  }, []);

  const searchCustomers = async (params: CustomerSearchParams): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      let filtered = [...customers];

      // Apply filters
      if (params.query) {
        const query = params.query.toLowerCase();
        filtered = filtered.filter(customer => 
          customer.name.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query)
        );
      }

      if (params.status && params.status !== 'all') {
        filtered = filtered.filter(customer => customer.status === params.status);
      }

      if (params.loyaltyTier && params.loyaltyTier !== 'all') {
        filtered = filtered.filter(customer => customer.loyaltyTier === params.loyaltyTier);
      }

      if (params.joinedAfter) {
        filtered = filtered.filter(customer => customer.joinedDate >= params.joinedAfter!);
      }

      if (params.joinedBefore) {
        filtered = filtered.filter(customer => customer.joinedDate <= params.joinedBefore!);
      }

      if (params.totalSpentMin) {
        filtered = filtered.filter(customer => customer.totalSpent >= params.totalSpentMin!);
      }

      if (params.totalSpentMax) {
        filtered = filtered.filter(customer => customer.totalSpent <= params.totalSpentMax!);
      }

      // Apply sorting
      if (params.sortBy) {
        filtered.sort((a, b) => {
          let aValue: any = a[params.sortBy as keyof CustomerSummary];
          let bValue: any = b[params.sortBy as keyof CustomerSummary];

          if (params.sortBy === 'joinedDate' || params.sortBy === 'lastActive') {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
          }

          if (params.sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });
      }

      // Pagination
      const page = params.page || 1;
      const limit = params.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedResults = filtered.slice(startIndex, endIndex);

      const result: CustomerSearchResult = {
        customers: paginatedResults,
        total: filtered.length,
        page,
        totalPages: Math.ceil(filtered.length / limit),
        hasMore: endIndex < filtered.length,
      };

      setSearchResults(result);
    } catch (error) {
      setError('Failed to search customers');
    } finally {
      setIsLoading(false);
    }
  };

  const getCustomerDetails = async (customerId: string): Promise<CustomerSummary | null> => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      return customer;
    }
    return null;
  };

  const updateCustomerStatus = async (customerId: string, status: 'active' | 'suspended' | 'pending'): Promise<void> => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId ? { ...customer, status } : customer
    ));

    if (selectedCustomer?.id === customerId) {
      setSelectedCustomer(prev => prev ? { ...prev, status } : null);
    }
  };

  const deleteCustomer = async (customerId: string): Promise<void> => {
    setCustomers(prev => prev.filter(customer => customer.id !== customerId));
    if (selectedCustomer?.id === customerId) {
      setSelectedCustomer(null);
    }
  };

  const refreshAnalytics = async (): Promise<void> => {
    setAnalytics(generateMockAnalytics(customers));
  };

  const addCustomerNote = async (customerId: string, note: string, type: CustomerNote['type'], isPrivate: boolean): Promise<void> => {
    const newNote: CustomerNote = {
      id: `note_${Date.now()}`,
      customerId,
      adminId: 'admin_1',
      note,
      type,
      isPrivate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCustomerNotes(prev => [newNote, ...prev]);
  };

  const updateCustomerNote = async (noteId: string, updates: Partial<CustomerNote>): Promise<void> => {
    setCustomerNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, ...updates, updatedAt: new Date() } : note
    ));
  };

  const deleteCustomerNote = async (noteId: string): Promise<void> => {
    setCustomerNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const getCustomerActivity = async (customerId: string, limit = 50): Promise<CustomerActivity[]> => {
    // Mock activity data
    const activities: CustomerActivity[] = Array.from({ length: 10 }, (_, i) => ({
      id: `activity_${customerId}_${i}`,
      customerId,
      type: ['login', 'order', 'profile_update'][Math.floor(Math.random() * 3)] as CustomerActivity['type'],
      description: `Sample activity ${i + 1}`,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
    }));

    setCustomerActivities(activities);
    return activities;
  };

  const bulkUpdateCustomers = async (customerIds: string[], updates: Partial<CustomerSummary>): Promise<void> => {
    setCustomers(prev => prev.map(customer => 
      customerIds.includes(customer.id) ? { ...customer, ...updates } : customer
    ));
  };

  const exportCustomersData = async (customerIds?: string[]): Promise<void> => {
    const dataToExport = customerIds 
      ? customers.filter(c => customerIds.includes(c.id))
      : customers;

    const csvContent = [
      'ID,Name,Email,Status,Loyalty Tier,Total Spent,Order Count,Joined Date,Last Active',
      ...dataToExport.map(c => 
        `${c.id},${c.name},${c.email},${c.status},${c.loyaltyTier},${c.totalSpent},${c.orderCount},${c.joinedDate.toISOString()},${c.lastActive.toISOString()}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomerIds(prev => 
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const selectAllCustomers = () => {
    const visibleCustomerIds = searchResults?.customers.map(c => c.id) || customers.map(c => c.id);
    setSelectedCustomerIds(visibleCustomerIds);
  };

  const clearSelection = () => {
    setSelectedCustomerIds([]);
  };

  const value: AdminCustomerContextType = {
    customers,
    selectedCustomer,
    searchResults,
    isLoading,
    error,
    analytics,
    refreshAnalytics,
    searchCustomers,
    getCustomerDetails,
    updateCustomerStatus,
    deleteCustomer,
    customerNotes,
    addCustomerNote,
    updateCustomerNote,
    deleteCustomerNote,
    customerActivities,
    getCustomerActivity,
    bulkUpdateCustomers,
    exportCustomersData,
    selectedCustomerIds,
    toggleCustomerSelection,
    selectAllCustomers,
    clearSelection,
    currentView,
    setCurrentView,
  };

  return (
    <AdminCustomerContext.Provider value={value}>
      {children}
    </AdminCustomerContext.Provider>
  );
};