import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';

const QuickActions = ({ showArchived, onToggleArchived }) => {
  return (
    <Card>
      <Text type="h3" className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Quick Actions</Text>
      <div className="space-y-2">
        <Button
          onClick={onToggleArchived}
          className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300"
          iconName={showArchived ? "Eye" : "Archive"}
        >
          {showArchived ? 'View Active Tasks' : 'View Archive'}
        </Button>
      </div>
    </Card>
  );
};

export default QuickActions;