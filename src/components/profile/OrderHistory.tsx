import React from 'react';
import { Package } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';

const OrderHistory: React.FC = () => {
  const { orderHistory } = useProfile();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Order History</h2>
      <div className="space-y-4">
        {orderHistory.map((order) => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Package className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium">Order #{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">₹{order.totalAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-500 capitalize">{order.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;