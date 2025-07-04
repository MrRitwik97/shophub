import React from 'react';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatIndianCurrency } from '../utils/currency';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, onCheckout }) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getCartItemsWithProducts,
    calculateTotals,
  } = useCart();

  const cartItems = getCartItemsWithProducts();
  const totals = calculateTotals();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Shopping Cart ({cart.totalItems})
            </h2>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-4">Start shopping to add items to your cart</p>
                <button
                  onClick={onClose}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex gap-4 border-b pb-4">
                    {/* Product Image */}
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.product.category}
                        {item.product.subcategory && ` - ${item.product.subcategory}`}
                      </p>
                      
                      {/* Price */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-medium text-gray-900">
                          {formatIndianCurrency(item.product.discountedPrice || item.product.regularPrice)}
                        </span>
                        {item.product.discountedPrice && (
                          <span className="text-xs text-gray-500 line-through">
                            {formatIndianCurrency(item.product.regularPrice)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Stock Warning */}
                      {item.quantity >= item.product.stock && (
                        <p className="text-xs text-orange-600 mt-1">
                          Only {item.product.stock} left in stock
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Summary and Checkout */}
          {cartItems.length > 0 && (
            <div className="border-t bg-gray-50 p-4">
              {/* Order Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatIndianCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {totals.shippingCost === 0 ? 'Free' : formatIndianCurrency(totals.shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST)</span>
                  <span className="font-medium">{formatIndianCurrency(totals.tax)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatIndianCurrency(totals.total)}</span>
                </div>
              </div>

              {/* Shipping Notice */}
              {totals.shippingCost === 0 ? (
                <p className="text-sm text-green-600 mt-2">
                  🎉 You qualify for free shipping!
                </p>
              ) : (
                <p className="text-sm text-gray-600 mt-2">
                  Add {formatIndianCurrency(50000 - totals.subtotal)} more for free shipping
                </p>
              )}

              {/* Checkout Button */}
              <button
                onClick={onCheckout}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* Continue Shopping */}
              <button
                onClick={onClose}
                className="w-full text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition-colors mt-2"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};