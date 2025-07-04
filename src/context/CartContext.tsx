import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, CartItem, Product, Order, Address, PaymentMethod } from '../types';
import { useAuth } from './AuthContext';
import { useEcommerce } from './EcommerceContext';

interface CartContextType {
  cart: Cart;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  // Cart operations
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartItemsWithProducts: () => (CartItem & { product: Product })[];
  // UI state
  toggleCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  // Checkout
  calculateTotals: () => {
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
  };
  createOrder: (shippingAddress: Address, billingAddress: Address, paymentMethod: PaymentMethod) => Promise<Order>;
  // Storage
  saveCartToStorage: () => void;
  loadCartFromStorage: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { products } = useEcommerce();
  
  const [cart, setCart] = useState<Cart>({
    id: 'cart-' + Date.now(),
    userId: user?.id,
    items: [],
    totalItems: 0,
    totalAmount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Calculate totals whenever cart items change
  useEffect(() => {
    const calculateCartTotals = () => {
      const itemsWithProducts = getCartItemsWithProducts();
      const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = itemsWithProducts.reduce((sum, item) => {
        const price = item.product.discountedPrice || item.product.regularPrice;
        return sum + (price * item.quantity);
      }, 0);

      setCart(prev => ({
        ...prev,
        totalItems,
        totalAmount,
        updatedAt: new Date(),
      }));
    };

    calculateCartTotals();
  }, [cart.items, products]);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    saveCartToStorage();
  }, [cart]);

  // Load cart from localStorage on mount
  useEffect(() => {
    loadCartFromStorage();
  }, [user]);

  const getCartItemsWithProducts = (): (CartItem & { product: Product })[] => {
    return cart.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }
      return { ...item, product };
    }).filter(item => item.product);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existingItemIndex = prev.items.findIndex(item => item.productId === product.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prev.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        
        return {
          ...prev,
          items: updatedItems,
          updatedAt: new Date(),
        };
      } else {
        // Add new item
        const newItem: CartItem = {
          productId: product.id,
          quantity,
          addedAt: new Date(),
        };
        
        return {
          ...prev,
          items: [...prev.items, newItem],
          updatedAt: new Date(),
        };
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(item => item.productId !== productId),
      updatedAt: new Date(),
    }));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      ),
      updatedAt: new Date(),
    }));
  };

  const clearCart = () => {
    setCart(prev => ({
      ...prev,
      items: [],
      totalItems: 0,
      totalAmount: 0,
      updatedAt: new Date(),
    }));
  };

  const calculateTotals = () => {
    const subtotal = cart.totalAmount;
    const shippingCost = subtotal > 50000 ? 0 : 5000; // Free shipping above ₹500
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + shippingCost + tax;

    return {
      subtotal,
      shippingCost,
      tax,
      total,
    };
  };

  const createOrder = async (
    shippingAddress: Address,
    billingAddress: Address,
    paymentMethod: PaymentMethod
  ): Promise<Order> => {
    const itemsWithProducts = getCartItemsWithProducts();
    const totals = calculateTotals();
    
    const order: Order = {
      id: 'order-' + Date.now(),
      userId: user?.id || 'guest',
      items: itemsWithProducts.map(item => ({
        ...item,
        price: item.product.discountedPrice || item.product.regularPrice,
      })),
      shippingAddress,
      billingAddress,
      paymentMethod,
      status: 'pending',
      subtotal: totals.subtotal,
      shippingCost: totals.shippingCost,
      tax: totals.tax,
      discount: 0,
      totalAmount: totals.total,
      orderNumber: 'SH' + Date.now().toString().slice(-8),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In a real app, this would be an API call
    // For now, we'll simulate order creation
    return new Promise((resolve) => {
      setTimeout(() => {
        // Clear cart after successful order
        clearCart();
        closeCheckout();
        closeCart();
        resolve(order);
      }, 1000);
    });
  };

  const toggleCart = () => setIsCartOpen(prev => !prev);
  const closeCart = () => setIsCartOpen(false);
  const openCheckout = () => {
    setIsCheckoutOpen(true);
    setIsCartOpen(false);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const saveCartToStorage = () => {
    try {
      const cartKey = user?.id ? `cart_${user.id}` : 'cart_guest';
      localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  };

  const loadCartFromStorage = () => {
    try {
      const cartKey = user?.id ? `cart_${user.id}` : 'cart_guest';
      const savedCart = localStorage.getItem(cartKey);
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(prev => ({
          ...prev,
          items: parsedCart.items || [],
          userId: user?.id,
        }));
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      isCartOpen,
      isCheckoutOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartItemsWithProducts,
      toggleCart,
      closeCart,
      openCheckout,
      closeCheckout,
      calculateTotals,
      createOrder,
      saveCartToStorage,
      loadCartFromStorage,
    }}>
      {children}
    </CartContext.Provider>
  );
};