import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, Filter, SortOption } from '../types';
import { products as initialProducts, categories as initialCategories } from '../data/mockData';
import { useAuth } from './AuthContext';

interface EcommerceContextType {
  products: Product[];
  categories: Category[];
  filteredProducts: Product[];
  filter: Filter;
  sortOption: SortOption;
  selectedProduct: Product | null;
  isAdminPanelOpen: boolean;
  isUserAdmin: boolean;
  // Product management
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  // Category management
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  // Filtering and sorting
  setFilter: (filter: Filter) => void;
  setSortOption: (sort: SortOption) => void;
  setSelectedProduct: (product: Product | null) => void;
  // Admin panel control
  toggleAdminPanel: () => void;
  closeAdminPanel: () => void;
}

const EcommerceContext = createContext<EcommerceContextType | undefined>(undefined);

export const useEcommerce = () => {
  const context = useContext(EcommerceContext);
  if (!context) {
    throw new Error('useEcommerce must be used within an EcommerceProvider');
  }
  return context;
};

export const EcommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [filter, setFilter] = useState<Filter>({});
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Check if current user is admin
  const isUserAdmin = isAuthenticated && user?.role === 'admin';

  // Filter and sort products
  useEffect(() => {
    let filtered = products;

    // Apply filters
    if (filter.category) {
      filtered = filtered.filter(p => p.category === filter.category);
    }
    if (filter.subcategory) {
      filtered = filtered.filter(p => p.subcategory === filter.subcategory);
    }
    if (filter.minPrice !== undefined) {
      filtered = filtered.filter(p => (p.discountedPrice || p.regularPrice) >= filter.minPrice!);
    }
    if (filter.maxPrice !== undefined) {
      filtered = filtered.filter(p => (p.discountedPrice || p.regularPrice) <= filter.maxPrice!);
    }
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    filtered = filtered.sort((a, b) => {
      switch (sortOption) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          const priceA = a.discountedPrice || a.regularPrice;
          const priceB = b.discountedPrice || b.regularPrice;
          return priceA - priceB;
        case 'price-high':
          const priceA2 = a.discountedPrice || a.regularPrice;
          const priceB2 = b.discountedPrice || b.regularPrice;
          return priceB2 - priceA2;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, filter, sortOption]);

  // Product management
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Category management
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString()
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const toggleAdminPanel = () => {
    if (isUserAdmin) {
      setIsAdminPanelOpen(prev => !prev);
    }
  };

  const closeAdminPanel = () => {
    setIsAdminPanelOpen(false);
  };

  // Close admin panel when user logs out or is no longer admin
  useEffect(() => {
    if (!isUserAdmin) {
      setIsAdminPanelOpen(false);
    }
  }, [isUserAdmin]);

  return (
    <EcommerceContext.Provider value={{
      products,
      categories,
      filteredProducts,
      filter,
      sortOption,
      selectedProduct,
      isAdminPanelOpen,
      isUserAdmin,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      setFilter,
      setSortOption,
      setSelectedProduct,
      toggleAdminPanel,
      closeAdminPanel
    }}>
      {children}
    </EcommerceContext.Provider>
  );
};