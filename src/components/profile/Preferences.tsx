import React from 'react';
import { Settings } from 'lucide-react';

const Preferences: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Preferences</h2>
      <div className="text-center py-12">
        <Settings className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Preferences</h3>
        <p className="mt-1 text-sm text-gray-500">Manage your account preferences.</p>
      </div>
    </div>
  );
};

export default Preferences;