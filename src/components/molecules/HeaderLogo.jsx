import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const HeaderLogo = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center shadow-card">
        <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
      </div>
      <div>
        <Text type="h1" className="text-xl font-bold text-surface-900 dark:text-white">TaskFlow</Text>
        <Text type="p" className="text-sm text-surface-600 dark:text-surface-400">Organize your daily tasks</Text>
      </div>
    </div>
  );
};

export default HeaderLogo;