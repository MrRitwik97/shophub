import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  MoreVertical,
  TrendingUp,
  UserCheck,
  UserPlus,
  Activity
} from 'lucide-react';
import { useAdminCustomers } from '../../context/AdminCustomerContext';
import { CustomerSearchParams } from '../../types/profile';
import CustomerAnalyticsDashboard from './CustomerAnalyticsDashboard';
import CustomerDetailsView from './CustomerDetailsView';

const CustomerManagement: React.FC = () => {
  const {
    customers,
    searchResults,
    analytics,
    isLoading,
    error,
    currentView,
    setCurrentView,
    selectedCustomerIds,
    searchCustomers,
    getCustomerDetails,
    updateCustomerStatus,
    deleteCustomer,
    exportCustomersData,
    toggleCustomerSelection,
    selectAllCustomers,
    clearSelection
  } = useAdminCustomers();

  const [searchParams, setSearchParams] = useState<CustomerSearchParams>({
    query: '',
    status: 'all',
    loyaltyTier: 'all',
    sortBy: 'joinedDate',
    sortOrder: 'desc',
    page: 1,
    limit: 20
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Initial search
  useEffect(() => {
    searchCustomers(searchParams);
  }, []);

  const handleSearch = async () => {
    await searchCustomers(searchParams);
  };

  const handleFilterChange = (key: keyof CustomerSearchParams, value: any) => {
    setSearchParams(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleCustomerAction = async (customerId: string, action: 'view' | 'edit' | 'suspend' | 'activate' | 'delete') => {
    switch (action) {
      case 'view':
        await getCustomerDetails(customerId);
        setSelectedCustomerId(customerId);
        setCurrentView('details');
        break;
      case 'suspend':
        await updateCustomerStatus(customerId, 'suspended');
        await searchCustomers(searchParams); // Refresh list
        break;
      case 'activate':
        await updateCustomerStatus(customerId, 'active');
        await searchCustomers(searchParams);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this customer?')) {
          await deleteCustomer(customerId);
          await searchCustomers(searchParams);
        }
        break;
    }
  };

  const handleBulkAction = async (action: 'export' | 'activate' | 'suspend' | 'delete') => {
    if (selectedCustomerIds.length === 0) {
      alert('Please select customers first');
      return;
    }

    switch (action) {
      case 'export':
        await exportCustomersData(selectedCustomerIds);
        break;
      case 'activate':
        for (const id of selectedCustomerIds) {
          await updateCustomerStatus(id, 'active');
        }
        await searchCustomers(searchParams);
        clearSelection();
        break;
      case 'suspend':
        for (const id of selectedCustomerIds) {
          await updateCustomerStatus(id, 'suspended');
        }
        await searchCustomers(searchParams);
        clearSelection();
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedCustomerIds.length} customers?`)) {
          for (const id of selectedCustomerIds) {
            await deleteCustomer(id);
          }
          await searchCustomers(searchParams);
          clearSelection();
        }
        break;
    }
  };

  const renderTabButton = (tab: 'list' | 'analytics' | 'details', label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setCurrentView(tab)}
      className={`inline-flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
        currentView === tab
          ? 'border-indigo-500 text-indigo-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );

  if (currentView === 'analytics') {
    return <CustomerAnalyticsDashboard />;
  }

  if (currentView === 'details' && selectedCustomerId) {
    return <CustomerDetailsView customerId={selectedCustomerId} />;
  }

  const displayCustomers = searchResults?.customers || customers;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your customers, view analytics, and track customer activity
        </p>
      </div>

      {/* Quick Stats */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalCustomers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.activeCustomers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserPlus className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">New This Month</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.newCustomersThisMonth}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg. Lifetime Value</p>
                <p className="text-2xl font-bold text-gray-900">₹{analytics.customerLifetimeValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {renderTabButton('list', 'Customer List', <Users className="h-5 w-5" />)}
          {renderTabButton('analytics', 'Analytics', <Activity className="h-5 w-5" />)}
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search customers by name or email..."
                value={searchParams.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Search
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={searchParams.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loyalty Tier</label>
              <select
                value={searchParams.loyaltyTier}
                onChange={(e) => handleFilterChange('loyaltyTier', e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Tiers</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={searchParams.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="joinedDate">Joined Date</option>
                <option value="lastActive">Last Active</option>
                <option value="totalSpent">Total Spent</option>
                <option value="orderCount">Order Count</option>
                <option value="name">Name</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <select
                value={searchParams.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedCustomerIds.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-sm font-medium text-indigo-900">
                {selectedCustomerIds.length} customer(s) selected
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleBulkAction('export')}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
              <button
                onClick={() => handleBulkAction('activate')}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('suspend')}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
              >
                Suspend
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
              >
                Delete
              </button>
              <button
                onClick={clearSelection}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              onChange={(e) => e.target.checked ? selectAllCustomers() : clearSelection()}
              checked={selectedCustomerIds.length === displayCustomers.length && displayCustomers.length > 0}
            />
            <div className="ml-6 grid grid-cols-12 gap-4 w-full text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-3">Customer</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Loyalty Tier</div>
              <div className="col-span-2">Total Spent</div>
              <div className="col-span-2">Last Active</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <div className="px-6 py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading customers...</p>
            </div>
          ) : displayCustomers.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
            </div>
          ) : (
            displayCustomers.map((customer) => (
              <div key={customer.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={selectedCustomerIds.includes(customer.id)}
                    onChange={() => toggleCustomerSelection(customer.id)}
                  />
                  <div className="ml-6 grid grid-cols-12 gap-4 w-full">
                    <div className="col-span-3">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        customer.status === 'active' ? 'bg-green-100 text-green-800' :
                        customer.status === 'suspended' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {customer.status}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                        customer.loyaltyTier === 'platinum' ? 'bg-purple-100 text-purple-800' :
                        customer.loyaltyTier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                        customer.loyaltyTier === 'silver' ? 'bg-gray-100 text-gray-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {customer.loyaltyTier}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-900">₹{customer.totalSpent.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{customer.orderCount} orders</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-900">
                        {customer.lastActive.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="col-span-1">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCustomerAction(customer.id, 'view')}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleCustomerAction(customer.id, customer.status === 'active' ? 'suspend' : 'activate')}
                          className={customer.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}
                          title={customer.status === 'active' ? 'Suspend' : 'Activate'}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleCustomerAction(customer.id, 'delete')}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {searchResults && searchResults.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing {((searchResults.page - 1) * (searchParams.limit || 20)) + 1} to{' '}
                  {Math.min(searchResults.page * (searchParams.limit || 20), searchResults.total)} of{' '}
                  {searchResults.total} results
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleFilterChange('page', Math.max(1, searchResults.page - 1))}
                  disabled={searchResults.page <= 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {searchResults.page} of {searchResults.totalPages}
                </span>
                <button
                  onClick={() => handleFilterChange('page', Math.min(searchResults.totalPages, searchResults.page + 1))}
                  disabled={searchResults.page >= searchResults.totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;