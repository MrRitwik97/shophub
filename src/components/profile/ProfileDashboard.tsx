import React, { useState } from 'react';
import { User, Settings, Package, Heart, MapPin, Activity, Gift, Shield, Download, Trash2 } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { useAuth } from '../../context/AuthContext';
import ProfileOverview from './ProfileOverview';
import PersonalInfo from './PersonalInfo';
import AddressBook from './AddressBook';
import OrderHistory from './OrderHistory';
import Wishlist from './Wishlist';
import LoyaltyProgram from './LoyaltyProgram';
import AccountSecurity from './AccountSecurity';
import ActivityLog from './ActivityLog';
import Preferences from './Preferences';

type ProfileTab = 
  | 'overview' 
  | 'personal' 
  | 'addresses' 
  | 'orders' 
  | 'wishlist' 
  | 'loyalty' 
  | 'security' 
  | 'activity' 
  | 'preferences';

const ProfileDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const { customerProfile, isLoading, exportCustomerData, deleteAccount } = useProfile();
  const { logout } = useAuth();

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'addresses', label: 'Address Book', icon: MapPin },
    { id: 'orders', label: 'Order History', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'loyalty', label: 'Loyalty Program', icon: Gift },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'activity', label: 'Activity Log', icon: Activity },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  const handleExportData = async () => {
    try {
      await exportCustomerData();
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (confirmed) {
      const password = window.prompt('Please enter your password to confirm:');
      if (password) {
        try {
          await deleteAccount(password);
          logout();
        } catch (error) {
          alert('Failed to delete account. Please try again.');
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!customerProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load profile. Please try again.</p>
        </div>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <ProfileOverview />;
      case 'personal':
        return <PersonalInfo />;
      case 'addresses':
        return <AddressBook />;
      case 'orders':
        return <OrderHistory />;
      case 'wishlist':
        return <Wishlist />;
      case 'loyalty':
        return <LoyaltyProgram />;
      case 'security':
        return <AccountSecurity />;
      case 'activity':
        return <ActivityLog />;
      case 'preferences':
        return <Preferences />;
      default:
        return <ProfileOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="mt-2 text-gray-600">
            Manage your account settings, orders, and preferences
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Profile Summary */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {customerProfile.firstName} {customerProfile.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{customerProfile.email}</p>
                  </div>
                </div>
                
                {/* Profile Completion */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Profile Completion</span>
                    <span>{customerProfile.profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${customerProfile.profileCompletion}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="px-0 py-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as ProfileTab)}
                      className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              {/* Data Management */}
              <div className="p-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Data Management</h4>
                <div className="space-y-2">
                  <button
                    onClick={handleExportData}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export My Data
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-8 lg:mt-0 lg:col-span-9">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {renderActiveTab()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;