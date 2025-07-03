import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { useEcommerce } from '../context/EcommerceContext';
import { SortOption } from '../types';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ isOpen, onClose }) => {
  const { categories, filter, setFilter, sortOption, setSortOption } = useEcommerce();
  const [priceRange, setPriceRange] = useState({
    min: filter.minPrice || '',
    max: filter.maxPrice || ''
  });

  const handleCategoryChange = (category: string) => {
    setFilter({
      ...filter,
      category: filter.category === category ? undefined : category,
      subcategory: undefined
    });
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setFilter({
      ...filter,
      subcategory: filter.subcategory === subcategory ? undefined : subcategory
    });
  };

  const handlePriceRangeApply = () => {
    setFilter({
      ...filter,
      minPrice: priceRange.min ? parseFloat(priceRange.min) : undefined,
      maxPrice: priceRange.max ? parseFloat(priceRange.max) : undefined
    });
  };

  const clearFilters = () => {
    setFilter({});
    setPriceRange({ min: '', max: '' });
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sort Options */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Sort By</h3>
            <div className="space-y-2">
              {[
                { value: 'newest' as SortOption, label: 'Newest First' },
                { value: 'name' as SortOption, label: 'Name A-Z' },
                { value: 'price-low' as SortOption, label: 'Price: Low to High' },
                { value: 'price-high' as SortOption, label: 'Price: High to Low' }
              ].map(option => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="sort"
                    value={option.value}
                    checked={sortOption === option.value}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handlePriceRangeApply}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply Price Range
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category.id}>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filter.category === category.name}
                      onChange={() => handleCategoryChange(category.name)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </label>
                  {/* Subcategories */}
                  {category.subcategories && filter.category === category.name && (
                    <div className="ml-6 mt-2 space-y-1">
                      {category.subcategories.map(subcategory => (
                        <label key={subcategory.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filter.subcategory === subcategory.name}
                            onChange={() => handleSubcategoryChange(subcategory.name)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600">{subcategory.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  );
};