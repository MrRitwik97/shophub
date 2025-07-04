import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X, User, Settings, LogOut } from 'lucide-react';
import { useEcommerce } from '../context/EcommerceContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { AuthModal } from './auth/AuthModal';

export const Header: React.FC = () => {
  const { categories, setFilter, filter, isAdminPanelOpen, isUserAdmin, toggleAdminPanel } = useEcommerce();
  const { user, isAuthenticated, logout } = useAuth();
  const { cart, toggleCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter({ ...filter, search: searchTerm });
  };

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const handleUserMenuClick = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Top bar */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">ShopHub</h1>
            </div>
            
            {/* Search bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={handleUserMenuClick}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user?.firstName}
                    </span>
                  </button>

                  {/* User dropdown menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          // Navigate to profile (you can implement routing here)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </button>

                      {isUserAdmin && (
                        <button
                          onClick={() => {
                            toggleAdminPanel();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <Settings className="h-4 w-4" />
                          <span>{isAdminPanelOpen ? 'Exit Admin Panel' : 'Admin Panel'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              <button 
                onClick={toggleCart}
                className="p-2 hover:bg-gray-100 rounded-full relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {cart.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cart.totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block border-t border-gray-200`}>
            <div className="py-4">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
                <button
                  onClick={() => setFilter({})}
                  className="text-gray-700 hover:text-blue-600 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors text-left"
                >
                  All Products
                </button>
                {categories.map(category => (
                  <div key={category.id} className="relative group">
                    <button
                      onClick={() => setFilter({ category: category.name })}
                      className="text-gray-700 hover:text-blue-600 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors text-left"
                    >
                      {category.name}
                    </button>
                    {category.subcategories && (
                      <div className="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        {category.subcategories.map(subcategory => (
                          <button
                            key={subcategory.id}
                            onClick={() => setFilter({ 
                              category: category.name, 
                              subcategory: subcategory.name 
                            })}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 first:rounded-t-md last:rounded-b-md"
                          >
                            {subcategory.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </nav>

          {/* Mobile search */}
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
};