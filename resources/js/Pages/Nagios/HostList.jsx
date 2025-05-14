import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function HostList({ hosts }) {
  const [loadingHost, setLoadingHost] = useState(null);

  const handleAction = (host, action) => {
    setLoadingHost(host);

    router.post(`/nagios/${action}`, { host }, {
      preserveScroll: true,
      onFinish: () => setLoadingHost(null),
    });
  };

  const hostEntries = Object.entries(hosts);

  return (
    <DashboardLayout title="Заявки" sidebar="tickets">

    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Nagios Host List</h1>
      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Host</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {hostEntries.map(([host, status]) => (
            <tr key={host}>
              <td className="border p-2">{host}</td>
              <td className="border p-2 space-x-2 text-center">
                <button
                  onClick={() => handleAction(host, 'disable')}
                  disabled={loadingHost === host}
                  className="bg-yellow-400 text-black px-2 py-1 rounded hover:bg-yellow-500"
                >
                  Disable
                </button>
                <button
                  onClick={() => handleAction(host, 'enable')}
                  disabled={loadingHost === host}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  Enable
                </button>
                <button
                  onClick={() => handleAction(host, 'downtime')}
                  disabled={loadingHost === host}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Downtime
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </DashboardLayout>
  );
}
