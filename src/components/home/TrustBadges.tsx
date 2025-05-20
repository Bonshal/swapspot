import React from 'react';
import { Shield, CreditCard, Users, MessageSquare } from 'lucide-react';

const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: <Shield className="h-10 w-10 text-primary-500" />,
      title: 'Secure Transactions',
      description: 'Our secure payment system protects buyers and sellers',
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary-500" />,
      title: 'Payment Protection',
      description: 'Your money is held safely until you receive your item',
    },
    {
      icon: <Users className="h-10 w-10 text-primary-500" />,
      title: 'Verified Users',
      description: 'Know who you\'re dealing with through our verification system',
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary-500" />,
      title: 'Instant Messaging',
      description: 'Communicate securely with buyers and sellers',
    },
  ];

  return (
    <section className="py-12 bg-neutral-50">
      <div className="container-custom mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2 text-center">
          Why Choose SwapSpot?
        </h2>
        <p className="text-neutral-600 text-center mb-10 max-w-2xl mx-auto">
          We provide a safe, easy-to-use platform for buying and selling, with features designed to protect your transactions
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 text-center"
            >
              <div className="mx-auto mb-4 flex justify-center">
                {badge.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{badge.title}</h3>
              <p className="text-neutral-600 text-sm">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;