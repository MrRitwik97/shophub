import React from 'react';
import { Heart } from 'lucide-react';

const Wishlist: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Wishlist</h2>
      <div className="text-center py-12">
        <Heart className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Your wishlist is empty</h3>
        <p className="mt-1 text-sm text-gray-500">Start adding items you love to your wishlist.</p>
      </div>
    </div>
  );
};

export default Wishlist;