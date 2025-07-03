import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useEcommerce } from '../context/EcommerceContext';

export const Breadcrumb: React.FC = () => {
  const { filter, setFilter } = useEcommerce();

  const breadcrumbs = [
    { label: 'Home', onClick: () => setFilter({}) }
  ];

  if (filter.category) {
    breadcrumbs.push({
      label: filter.category,
      onClick: () => setFilter({ category: filter.category })
    });
  }

  if (filter.subcategory) {
    breadcrumbs.push({
      label: filter.subcategory,
      onClick: () => setFilter({ category: filter.category, subcategory: filter.subcategory })
    });
  }

  if (filter.search) {
    breadcrumbs.push({
      label: `Search: "${filter.search}"`,
      onClick: () => {}
    });
  }

  if (breadcrumbs.length === 1) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Home className="h-4 w-4" />
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={index}>
          <button
            onClick={breadcrumb.onClick}
            className={`hover:text-blue-600 transition-colors ${
              index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : ''
            }`}
          >
            {breadcrumb.label}
          </button>
          {index < breadcrumbs.length - 1 && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};