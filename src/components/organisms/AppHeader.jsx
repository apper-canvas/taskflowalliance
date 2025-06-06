import { Link, useLocation } from 'react-router-dom';
import HeaderLogo from '@/components/molecules/HeaderLogo';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
const AppHeader = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white dark:bg-surface-800 shadow-soft border-b border-surface-200 dark:border-surface-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <HeaderLogo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-700'
              }`}
              aria-label="Go to home page"
            >
              Home
            </Link>
            <Link
              to="/projects"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/projects') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-700'
              }`}
              aria-label="Go to projects page"
            >
              Projects
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <nav className="flex md:hidden items-center space-x-4" aria-label="Main navigation">
            <Link
              to="/"
              className={`px-2 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white'
              }`}
              aria-label="Go to home page"
            >
              Home
            </Link>
            <Link
              to="/projects"
              className={`px-2 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                isActive('/projects') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white'
              }`}
              aria-label="Go to projects page"
            >
              Projects
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <ApperIcon
                name={darkMode ? "Sun" : "Moon"}
                className="w-5 h-5 text-surface-600 dark:text-surface-400"
              />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;