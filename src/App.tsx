import React, { useState } from 'react';
import { ShoppingCart, User, Settings } from 'lucide-react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { CartSidebar } from './components/CartSidebar';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPanel } from './components/AdminPanel';
import ProfileDashboard from './components/profile/ProfileDashboard';
import CustomerManagement from './components/admin/CustomerManagement';
import { AuthModal } from './components/auth/AuthModal';
import { EcommerceProvider } from './context/EcommerceContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProfileProvider } from './context/ProfileContext';
import { AdminCustomerProvider } from './context/AdminCustomerContext';
import { useAuth } from './context/AuthContext';
import { useEcommerce } from './context/EcommerceContext';

// Main App Content Component
const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { products, selectedProduct, setSelectedProduct } = useEcommerce();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentView, setCurrentView] = useState<'shop' | 'admin' | 'profile' | 'customers'>('shop');

  // Navigation based on user role and authentication
  const handleNavigation = (view: 'shop' | 'admin' | 'profile' | 'customers') => {
    if (!isAuthenticated && (view === 'admin' || view === 'profile' || view === 'customers')) {
      setIsAuthModalOpen(true);
      return;
    }
    
    if (view === 'admin' && user?.role !== 'admin') {
      alert('Admin access required');
      return;
    }
    
    if (view === 'customers' && user?.role !== 'admin') {
      alert('Admin access required');
      return;
    }
    
    setCurrentView(view);
  };

  // Render main content based on current view
  const renderMainContent = () => {
    if (selectedProduct) {
      return (
        <div className="container mx-auto px-4 py-8">
          <ProductDetail 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        </div>
      );
    }

    switch (currentView) {
      case 'admin':
        return <AdminPanel />;
      case 'profile':
        return <ProfileDashboard />;
      case 'customers':
        return <CustomerManagement />;
      case 'shop':
      default:
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h1>
              <p className="text-gray-600">Discover our latest collection of premium products</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header with Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <button
                onClick={() => handleNavigation('shop')}
                className="text-2xl font-bold text-indigo-600 hover:text-indigo-700"
              >
                ShopHub
              </button>
              
              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => handleNavigation('shop')}
                  className={`text-sm font-medium transition-colors ${
                    currentView === 'shop' 
                      ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' 
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Shop
                </button>
                
                {isAuthenticated && user?.role === 'customer' && (
                  <button
                    onClick={() => handleNavigation('profile')}
                    className={`text-sm font-medium transition-colors ${
                      currentView === 'profile' 
                        ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' 
                        : 'text-gray-700 hover:text-indigo-600'
                    }`}
                  >
                    My Account
                  </button>
                )}
                
                {isAuthenticated && user?.role === 'admin' && (
                  <>
                    <button
                      onClick={() => handleNavigation('admin')}
                      className={`text-sm font-medium transition-colors ${
                        currentView === 'admin' 
                          ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' 
                          : 'text-gray-700 hover:text-indigo-600'
                      }`}
                    >
                      Admin Panel
                    </button>
                    <button
                      onClick={() => handleNavigation('customers')}
                      className={`text-sm font-medium transition-colors ${
                        currentView === 'customers' 
                          ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' 
                          : 'text-gray-700 hover:text-indigo-600'
                      }`}
                    >
                      Customer Management
                    </button>
                  </>
                )}
              </nav>
            </div>

            {/* Header Actions */}
            <Header 
              onCartClick={() => setIsCartOpen(true)}
              onAuthClick={() => setIsAuthModalOpen(true)}
              setAuthMode={setAuthMode}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {renderMainContent()}
      </main>

      {/* Modals and Sidebars */}
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* User Status Indicator */}
      {isAuthenticated && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              Logged in as {user?.firstName} ({user?.role})
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component with Providers
const App: React.FC = () => {
  return (
    <AuthProvider>
      <EcommerceProvider>
        <CartProvider>
          <ProfileProvider>
            <AdminCustomerProvider>
              <AppContent />
            </AdminCustomerProvider>
          </ProfileProvider>
        </CartProvider>
      </EcommerceProvider>
    </AuthProvider>
  );
};

export default App;