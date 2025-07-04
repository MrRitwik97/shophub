import React from 'react';
import { Award } from 'lucide-react';

const LoyaltyProgram: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Loyalty Program</h2>
      <div className="text-center py-12">
        <Award className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Loyalty Program</h3>
        <p className="mt-1 text-sm text-gray-500">View your loyalty status and rewards.</p>
      </div>
    </div>
  );
};

export default LoyaltyProgram;