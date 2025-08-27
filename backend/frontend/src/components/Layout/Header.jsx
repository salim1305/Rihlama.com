import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { 
  Search, 
  Menu, 
  MapPin,
  User,
  Heart,
  MessageCircle,
  Settings,
  LogOut,
  Home
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useToast } from '../../hooks/use-toast';
import LanguageSelector from '../LanguageSelector';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: t('notifications.logoutSuccess'),
        description: t('notifications.logoutSuccessDesc'),
      });
      navigate('/');
    } catch (error) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <img 
                src="https://customer-assets.emergentagent.com/job_morocco-trips/artifacts/ysll1r0f_Logo%20simple.jpg" 
                alt="Rihla Logo" 
                className="w-10 h-10 rounded-xl object-cover"
              />
            </div>
            <span className="text-2xl font-bold rihla-text-gradient">
              Rihla
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 hover:shadow-md transition-shadow">
                <button className="flex-1 text-left px-6 py-3 text-sm text-gray-600 hover:bg-gray-100 rounded-l-full transition-colors">
                  {t('header.whereTo')}
                </button>
                <div className="h-6 w-px bg-gray-300" />
                <button className="flex-1 text-left px-6 py-3 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                  {t('header.when')}
                </button>
                <div className="h-6 w-px bg-gray-300" />
                <button className="flex-1 text-left px-6 py-3 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                  {t('header.duration')}
                </button>
                <div className="h-6 w-px bg-gray-300" />
                <button className="flex-1 text-left px-6 py-3 text-sm text-gray-600 hover:bg-gray-100 rounded-r-full transition-colors">
                  {t('header.addGuests')}
                </button>
                <Button 
                  size="sm" 
                  className="rounded-full rihla-gradient-primary hover:shadow-lg m-2"
                  onClick={() => navigate('/search')}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            <Link 
              to="/host" 
              className="text-sm font-medium text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-colors"
            >
              {t('header.becomeHost')}
            </Link>
            
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 p-2 rounded-full border border-gray-300 hover:shadow-md transition-shadow">
                  <Menu className="h-4 w-4 text-gray-600" />
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar} alt={user.name || `${user.firstName} ${user.lastName}`} />
                    <AvatarFallback>{user.firstName ? user.firstName.charAt(0) : 'U'}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>{t('header.dashboard')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/bookings')}>
                    <Home className="mr-2 h-4 w-4" />
                    <span>{t('header.myBookings')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/favorites')}>
                    <Heart className="mr-2 h-4 w-4" />
                    <span>{t('header.favorites')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/messages')}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <span>{t('header.messages')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t('header.settings')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('header.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                  className="text-gray-700 hover:text-green-600"
                >
                  {t('header.login')}
                </Button>
                <Button 
                  onClick={() => navigate('/register')}
                  className="rihla-gradient-primary hover:shadow-lg"
                >
                  {t('header.signup')}
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => navigate('/search')}
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('header.dashboard')}
                  </Link>
                  <Link 
                    to="/bookings" 
                    className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('header.myBookings')}
                  </Link>
                  <Link 
                    to="/messages" 
                    className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('header.messages')}
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                  >
                    {t('header.logout')}
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                  >
                    {t('header.login')}
                  </button>
                  <Link 
                    to="/register" 
                    className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('header.signup')}
                  </Link>
                </>
              )}
              <Link 
                to="/host" 
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Become a host
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;