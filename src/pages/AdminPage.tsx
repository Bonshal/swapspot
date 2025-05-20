import React, { useState } from 'react';
import { migrateListingsToIncludeSubcategory } from '../utils/migration';
import Button from '../components/ui/Button';
import Layout from '../components/layout/Layout';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

/**
 * Admin page for running database migrations and other maintenance tasks
 * Only accessible to admin users
 */
const AdminPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [migrationResult, setMigrationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if user is admin (in a real app, this would be a proper role check)
  const isAdmin = isAuthenticated && user?.email === 'admin@swapspot.com';
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  const handleRunMigration = async () => {
    setIsLoading(true);
    try {
      const result = await migrateListingsToIncludeSubcategory();
      setMigrationResult(result);
    } catch (error) {
      setMigrationResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Database Migrations</h2>
          
          <div className="mb-8 p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Add Subcategory to Listings</h3>
            <p className="text-gray-600 mb-4">
              This migration will add a subcategory field to all existing listings that don't already have one.
              The subcategory will be determined based on the listing's category.
            </p>
            
            <Button
              variant="primary"
              onClick={handleRunMigration}
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Running Migration...' : 'Run Migration'}
            </Button>
            
            {migrationResult && (
              <div className={`mt-4 p-3 rounded-lg ${migrationResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <h4 className="font-medium">{migrationResult.success ? 'Migration Successful' : 'Migration Failed'}</h4>
                {migrationResult.success ? (
                  <div className="mt-2 text-sm">
                    <p>Total Processed: {migrationResult.totalProcessed}</p>
                    <p>Total Updated: {migrationResult.totalUpdated}</p>
                    <p>Errors: {migrationResult.errors}</p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm">{migrationResult.error}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
