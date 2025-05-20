import React from 'react';
import Layout from '../components/layout/Layout';
import AadhaarVerification from '../components/auth/AadhaarVerification';

const AadhaarVerificationPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <AadhaarVerification />
      </div>
    </Layout>
  );
};

export default AadhaarVerificationPage;
