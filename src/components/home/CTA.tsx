import React from 'react';
import Button from '../ui/Button';
import { PlusCircle } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="bg-primary-500 py-16">
      <div className="container-custom mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Turn Your Items into Cash?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Join millions of people selling their unwanted items. It takes less than 2 minutes to create a listing.
          </p>
          <Button
            variant="accent"
            size="lg"
            icon={<PlusCircle className="h-5 w-5" />}
            className="shadow-lg"
          >
            Start Selling Now
          </Button>
        </div>
      </div>
    </section>
  );
};

// Fast Refresh warning suppression - this file only exports React components
export default CTA;