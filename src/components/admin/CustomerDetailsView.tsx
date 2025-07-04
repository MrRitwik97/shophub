import React from 'react';
import { ArrowLeft, User, Mail, Phone, Calendar, Package } from 'lucide-react';
import { useAdminCustomers } from '../../context/AdminCustomerContext';

interface CustomerDetailsViewProps {
  customerId: string;
}

const CustomerDetailsView: React.FC<CustomerDetailsViewProps> = ({ customerId }) => {
  const { selectedCustomer, setCurrentView } = useAdminCustomers();

  if (!selectedCustomer) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-600">Customer not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentView('list')}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedCustomer.name}</h1>
            <p className="text-sm text-gray-500">Customer Details</p>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Name</p>
                <p className="text-sm text-gray-600">{selectedCustomer.name}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Joined Date</p>
                <p className="text-sm text-gray-600">{selectedCustomer.joinedDate.toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Package className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Total Orders</p>
                <p className="text-sm text-gray-600">{selectedCustomer.orderCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">₹{selectedCustomer.totalSpent.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Spent</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{selectedCustomer.orderCount}</p>
            <p className="text-sm text-gray-500">Orders Placed</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 capitalize">{selectedCustomer.loyaltyTier}</p>
            <p className="text-sm text-gray-500">Loyalty Tier</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsView;