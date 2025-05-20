import React from 'react';
import { Search } from 'lucide-react';
import Button from '../ui/Button';

const HeroSection: React.FC = () => {
  return (
    <div className="relative bg-primary-500 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-400 opacity-90"></div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>
      
      <div className="container-custom mx-auto relative z-10 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-slide-up">
            Buy and Sell Anything Near You
          </h1>
          
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Join millions of people buying and selling from each other everyday in your local community
          </p>
          
          <div className="flex flex-col md:flex-row items-center bg-white rounded-xl p-2 shadow-lg animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex-grow flex items-center w-full md:w-auto">
              <Search className="ml-2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="What are you looking for?"
                className="flex-grow px-3 py-3 focus:outline-none text-neutral-800"
              />
            </div>
            
            <div className="relative w-full md:w-auto mt-2 md:mt-0">
              <select className="appearance-none bg-neutral-100 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-700 w-full md:w-auto">
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="vehicles">Vehicles</option>
                <option value="property">Property</option>
                <option value="furniture">Furniture</option>
                <option value="fashion">Fashion</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            
            <Button 
              className="w-full md:w-auto mt-2 md:mt-0 md:ml-2" 
              size="lg"
            >
              Search
            </Button>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <a href="#popular-categories" className="text-white/80 hover:text-white transition-colors">
              <span className="text-white/90">Popular:</span> Electronics
            </a>
            <a href="#vehicles" className="text-white/80 hover:text-white transition-colors">
              Vehicles
            </a>
            <a href="#property" className="text-white/80 hover:text-white transition-colors">
              Property
            </a>
            <a href="#furniture" className="text-white/80 hover:text-white transition-colors">
              Furniture
            </a>
            <a href="#fashion" className="text-white/80 hover:text-white transition-colors">
              Fashion
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;