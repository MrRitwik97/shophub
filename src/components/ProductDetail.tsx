import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { Product } from '../types';
import { useEcommerce } from '../context/EcommerceContext';
import { useCart } from '../context/CartContext';
import { formatIndianCurrency } from '../utils/currency';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { categories } = useEcommerce();
  const { addToCart } = useCart();

  const currentPrice = product.discountedPrice || product.regularPrice;
  const hasDiscount = !!product.discountedPrice;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const getCategoryPath = () => {
    const category = categories.find(c => c.name === product.category);
    if (category && product.subcategory) {
      return `${category.name} > ${product.subcategory}`;
    }
    return product.category;
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <nav className="text-sm text-gray-500">
            <span>{getCategoryPath()}</span>
          </nav>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
                {hasDiscount && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 text-sm rounded-full">
                    -{Math.round(((product.regularPrice - product.discountedPrice!) / product.regularPrice) * 100)}% OFF
                  </span>
                )}
              </div>
              
              {product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl font-bold text-gray-900">{formatIndianCurrency(currentPrice)}</span>
                  {hasDiscount && (
                    <span className="text-lg text-gray-500 line-through">{formatIndianCurrency(product.regularPrice)}</span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                  {product.featured && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      Featured Product
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border border-gray-300 rounded-md min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button>
                  <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="border-t pt-4">
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="font-medium text-gray-900">Category</dt>
                    <dd className="text-gray-600">{product.category}</dd>
                  </div>
                  {product.subcategory && (
                    <div>
                      <dt className="font-medium text-gray-900">Subcategory</dt>
                      <dd className="text-gray-600">{product.subcategory}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};