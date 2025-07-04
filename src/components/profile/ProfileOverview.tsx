import React from 'react';
import { Package, Heart, MapPin, Award, TrendingUp, Clock, Star } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';

const ProfileOverview: React.FC = () => {
  const { customerProfile, loyaltyProgram, orderHistory, wishlistItems, addresses } = useProfile();

  if (!customerProfile) return null;

  const quickStats = [
    {
      label: 'Total Orders',
      value: customerProfile.orderCount,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Spent',
      value: `₹${customerProfile.totalSpent.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      label: 'Wishlist Items',
      value: wishlistItems.length,
      icon: Heart,
      color: 'bg-pink-500',
    },
    {
      label: 'Saved Addresses',
      value: addresses.length,
      icon: MapPin,
      color: 'bg-purple-500',
    },
  ];

  const recentOrders = orderHistory.slice(0, 3);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {customerProfile.firstName}!</h2>
        <p className="text-gray-600">Here's what's happening with your account.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Loyalty Program */}
        {loyaltyProgram && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center mb-4">
              <Award className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-semibold">Loyalty Program</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-indigo-100">Current Tier</span>
                <span className="font-semibold capitalize">{loyaltyProgram.tier}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-indigo-100">Points Balance</span>
                <span className="font-semibold">{loyaltyProgram.currentPoints}</span>
              </div>
              {loyaltyProgram.pointsToNextTier > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-indigo-100 mb-1">
                    <span>Progress to Next Tier</span>
                    <span>{loyaltyProgram.pointsToNextTier} points needed</span>
                  </div>
                  <div className="w-full bg-indigo-400 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.max(10, (loyaltyProgram.currentPoints / loyaltyProgram.nextTierPoints) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Account Status */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Account Status</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                customerProfile.accountStatus === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {customerProfile.accountStatus}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Member Since</span>
              <span className="font-medium">
                {new Date(customerProfile.joinedDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Active</span>
              <span className="font-medium">
                {new Date(customerProfile.lastActive).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Order Value</span>
              <span className="font-medium">₹{customerProfile.averageOrderValue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <button className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
              View All Orders
            </button>
          </div>
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          Order #{order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.items.length} items • ₹{order.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        order.status === 'delivered' ? 'text-green-600' :
                        order.status === 'shipped' ? 'text-blue-600' :
                        order.status === 'processing' ? 'text-yellow-600' :
                        'text-gray-600'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left">
            <Package className="h-6 w-6 text-indigo-600 mb-2" />
            <h4 className="font-medium text-gray-900">Track Orders</h4>
            <p className="text-sm text-gray-500">View order status and tracking</p>
          </button>
          <button className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left">
            <Heart className="h-6 w-6 text-pink-600 mb-2" />
            <h4 className="font-medium text-gray-900">Manage Wishlist</h4>
            <p className="text-sm text-gray-500">View and organize saved items</p>
          </button>
          <button className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left">
            <MapPin className="h-6 w-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Address Book</h4>
            <p className="text-sm text-gray-500">Manage shipping addresses</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;