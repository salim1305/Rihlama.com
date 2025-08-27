import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Globe, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                  <img 
                    src="https://customer-assets.emergentagent.com/job_morocco-trips/artifacts/ysll1r0f_Logo%20simple.jpg" 
                    alt="Rihla Logo" 
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                </div>
                <span className="text-xl font-bold">Rihla</span>
              </div>
              <p className="text-gray-400 text-sm max-w-xs">
                Where journeys meet people. Discover authentic Moroccan experiences with local hosts.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Explore */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Explore</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/search" className="text-gray-400 hover:text-white transition-colors">Find Experiences</Link></li>
                <li><Link to="/destinations" className="text-gray-400 hover:text-white transition-colors">Destinations</Link></li>
                <li><Link to="/categories" className="text-gray-400 hover:text-white transition-colors">Categories</Link></li>
                <li><Link to="/gift-cards" className="text-gray-400 hover:text-white transition-colors">Gift Cards</Link></li>
              </ul>
            </div>

            {/* Host */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Host</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/host" className="text-gray-400 hover:text-white transition-colors">Become a Host</Link></li>
                <li><Link to="/host-resources" className="text-gray-400 hover:text-white transition-colors">Host Resources</Link></li>
                <li><Link to="/host-community" className="text-gray-400 hover:text-white transition-colors">Host Community</Link></li>
                <li><Link to="/responsible-hosting" className="text-gray-400 hover:text-white transition-colors">Responsible Hosting</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/safety" className="text-gray-400 hover:text-white transition-colors">Safety Center</Link></li>
                <li><Link to="/cancellation" className="text-gray-400 hover:text-white transition-colors">Cancellation Options</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
              <div className="mt-6 space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>contact@rihlama.com</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Phone className="h-4 w-4" />
                  <span>+212 5XX-XXX-XXX</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
              <span>© 2024 Rihla. All rights reserved.</span>
              <div className="flex space-x-4">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Globe className="h-4 w-4" />
              <span>English (US)</span>
              <span>MAD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;