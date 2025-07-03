import React, { useState } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import { FilterSidebar } from './FilterSidebar';
import { ProductGrid } from './ProductGrid';
import { Breadcrumb } from './Breadcrumb';
import { useEcommerce } from '../context/EcommerceContext';

export const ProductListing: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { filteredProducts } = useEcommerce();

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />
      
      <div className="flex lg:space-x-8">
        {/* Filter Sidebar */}
        <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden bg-white border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Products ({filteredProducts.length})
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Product Grid */}
          <ProductGrid />
        </div>
      </div>
    </div>
  );
};