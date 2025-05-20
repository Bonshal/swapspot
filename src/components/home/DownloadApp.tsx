import React from 'react';
import Button from '../ui/Button';

const DownloadApp: React.FC = () => {
  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="container-custom mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left side - Content */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Take SwapSpot With You
            </h2>
            <p className="text-neutral-700 text-lg mb-6">
              Download our app to get the full experience. Browse listings, chat with sellers, and get notified about new deals anytime, anywhere.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="flex items-center justify-center"
                size="lg"
              >
                <img src="https://img.icons8.com/?size=100&id=CvcYJLPDqbVM&format=png" alt="Download on App Store" className="h-6 mr-2" />
                App Store
              </Button>
              
              <Button
                className="flex items-center justify-center"
                variant="outline"
                size="lg"
              >
                <img src="https://img.icons8.com/?size=100&id=1WnTCCmLQXG5&format=png" alt="Get it on Google Play" className="h-6 mr-2" />
                Google Play
              </Button>
            </div>
            
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                <img
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="User"
                  className="h-8 w-8 rounded-full border-2 border-white"
                />
                <img
                  src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="User"
                  className="h-8 w-8 rounded-full border-2 border-white"
                />
                <img
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="User"
                  className="h-8 w-8 rounded-full border-2 border-white"
                />
              </div>
              <p className="text-sm text-neutral-600">
                <span className="font-semibold text-neutral-900">4.8 ★</span> from over 10k reviews
              </p>
            </div>
          </div>
          
          {/* Right side - Image */}
          <div className="w-full md:w-1/2 relative">
            <div className="relative mx-auto max-w-xs">
              <div className="absolute inset-0 bg-primary-500 rounded-3xl blur-lg opacity-10 transform -rotate-6"></div>
              <img
                src="https://images.pexels.com/photos/193004/pexels-photo-193004.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="SwapSpot Mobile App"
                className="relative rounded-3xl shadow-lg transform rotate-3 border-8 border-white"
              />
              <div className="absolute top-0 right-0 bg-white rounded-full p-2 shadow-lg transform translate-x-1/4 -translate-y-1/4">
                <div className="bg-accent-500 text-white h-10 w-10 rounded-full flex items-center justify-center font-bold">
                  $
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;