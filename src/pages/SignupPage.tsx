import React from 'react';
import Layout from '../components/layout/Layout';
import SignupForm from '../components/auth/SignupForm';

const SignupPage: React.FC = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
        <SignupForm />
      </div>
    </Layout>
  );
};

export default SignupPage;
