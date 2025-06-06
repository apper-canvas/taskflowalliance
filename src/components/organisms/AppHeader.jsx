import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Bell, Settings, Sun, Moon, Menu, LogOut, User } from 'lucide-react';
import { AuthContext } from '../../App';
import HeaderLogo from '../molecules/HeaderLogo';
import Button from '../atoms/Button';

const AppHeader = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = async () => {
    await logout();
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.emailAddress) {
      return user.emailAddress.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <HeaderLogo />
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`transition-colors ${
                isActivePath('/') 
                  ? 'text-primary font-medium' 
                  : 'text-surface-700 dark:text-surface-300 hover:text-primary'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/projects" 
              className={`transition-colors ${
                isActivePath('/projects') 
                  ? 'text-primary font-medium' 
                  : 'text-surface-700 dark:text-surface-300 hover:text-primary'
              }`}
            >
              Projects
            </Link>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="p-2"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </Button>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors"
            >
              <span className="text-white text-sm font-medium">
                {getUserInitials()}
              </span>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-md shadow-lg border border-surface-200 dark:border-surface-700 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-surface-200 dark:border-surface-700">
                    <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-surface-600 dark:text-surface-400">
                      {user?.emailAddress}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      // Add profile navigation here if needed
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      // Add settings navigation here if needed
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
</div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;