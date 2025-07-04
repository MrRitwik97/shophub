import React from 'react';
import { Activity } from 'lucide-react';

const ActivityLog: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Activity Log</h2>
      <div className="text-center py-12">
        <Activity className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Activity Log</h3>
        <p className="mt-1 text-sm text-gray-500">View your account activity.</p>
      </div>
    </div>
  );
};

export default ActivityLog;