import React from 'react';
import { ShoppingCart, Eye, Edit, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { useEcommerce } from '../context/EcommerceContext';
import { useCart } from '../context/CartContext';
import { formatIndianCurrency } from '../utils/currency';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, deleteProduct, isUserAdmin } = useEcommerce();
  const { addToCart } = useCart();

  const currentPrice = product.discountedPrice || product.regularPrice;
  const hasDiscount = !!product.discountedPrice;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(product.id);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded-full">
            -{Math.round(((product.regularPrice - product.discountedPrice!) / product.regularPrice) * 100)}%
          </span>
        )}
        {product.featured && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 text-xs rounded-full">
            Featured
          </span>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
            <button
              onClick={() => setSelectedProduct(product)}
              className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Eye className="h-4 w-4" />
            </button>
            {isUserAdmin && (
              <>
                <button className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-gray-900">{formatIndianCurrency(currentPrice)}</span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">{formatIndianCurrency(product.regularPrice)}</span>
            )}
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{product.category}</span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};