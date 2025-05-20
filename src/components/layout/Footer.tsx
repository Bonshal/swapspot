import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 text-neutral-200 pt-12 pb-6">
      <div className="container-custom mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">SwapSpot</h3>
            <p className="text-neutral-400 mb-4">
              The trusted marketplace to buy and sell anything near you. Join millions of users making deals every day.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Electronics</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Vehicles</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Property</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Furniture</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Fashion</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Jobs</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Services</a></li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Help & Support</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail size={18} className="mr-2 mt-1 text-neutral-400" />
                <span className="text-neutral-400">support@swapspot.com</span>
              </li>
              <li className="flex items-start">
                <Phone size={18} className="mr-2 mt-1 text-neutral-400" />
                <span className="text-neutral-400">+1 (800) 123-4567</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-white font-medium mb-3">Download Our App</h4>
              <div className="flex space-x-4">
                <a href="#" className="block">
                  <img src="https://img.icons8.com/?size=100&id=CvcYJLPDqbVM&format=png" alt="Download on App Store" className="h-10" />
                </a>
                <a href="#" className="block">
                  <img src="https://img.icons8.com/?size=100&id=1WnTCCmLQXG5&format=png" alt="Get it on Google Play" className="h-10" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between">
            <p className="text-neutral-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} SwapSpot. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="text-neutral-500 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-neutral-500 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-neutral-500 hover:text-white text-sm transition-colors">Cookies</a>
              <a href="#" className="text-neutral-500 hover:text-white text-sm transition-colors">Sitemap</a>
              <a href="#" className="text-neutral-500 hover:text-white text-sm transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;