import HeaderLogo from '@/components/molecules/HeaderLogo';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const AppHeader = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className="bg-white dark:bg-surface-800 shadow-soft border-b border-surface-200 dark:border-surface-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <HeaderLogo />

          <div className="flex items-center space-x-4">
            <Button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600"
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