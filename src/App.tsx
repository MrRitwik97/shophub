import React from 'react';
import { Header } from './components/Header';
import { Homepage } from './components/Homepage';
import { ProductListing } from './components/ProductListing';
import { ProductDetail } from './components/ProductDetail';
import { AdminPanel } from './components/AdminPanel';
import { UserProfile } from './components/auth/UserProfile';
import { EcommerceProvider, useEcommerce } from './context/EcommerceContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { selectedProduct, setSelectedProduct, filter, isAdmin } = useEcommerce();
  const { isAuthenticated, user, isLoading } = useAuth();

  const showHomepage = !filter.category && !filter.subcategory && !filter.search;

  // Show loading spinner while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {isAdmin && isAuthenticated && user?.role === 'admin' ? (
        <AdminPanel />
      ) : (
        <>
          {showHomepage ? <Homepage /> : <ProductListing />}
          
          {selectedProduct && (
            <ProductDetail
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
            />
          )}
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <EcommerceProvider>
        <AppContent />
      </EcommerceProvider>
    </AuthProvider>
  );
}

export default App;