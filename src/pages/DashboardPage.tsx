import React from 'react';
import Layout from '../components/layout/Layout';

const DashboardPage: React.FC = () => {
  return (
    <Layout>
      <div className="container p-6 mx-auto">
        <h1 className="mb-6 text-3xl font-bold">My Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold">My Listings</h2>
            <p className="text-gray-600">You currently have no active listings.</p>
            <button className="px-4 py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
              Create New Listing
            </button>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Messages</h2>
            <p className="text-gray-600">You have no unread messages.</p>
            <button className="px-4 py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
              View All Messages
            </button>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Account Settings</h2>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#" className="hover:text-indigo-600">Profile Settings</a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600">Notification Preferences</a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600">Payment Methods</a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600">Security & Privacy</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Recently Viewed</h2>
          <p className="text-gray-600">You haven't viewed any listings recently.</p>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
