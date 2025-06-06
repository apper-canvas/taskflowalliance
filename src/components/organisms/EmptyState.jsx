import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const EmptyState = ({ type, searchQuery, onCreateTask }) => {
  const iconName = type === 'archived' ? 'Archive' : (searchQuery ? 'Search' : 'CheckSquare');
  const title = type === 'archived' ? 'No archived tasks' : (searchQuery ? 'No tasks found' : 'No tasks yet');
  const description = type === 'archived'
    ? 'Complete some tasks to see them here'
    : (searchQuery
      ? 'Try adjusting your search or filters'
      : 'Create your first task to get started');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="w-24 h-24 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon
          name={iconName}
          className="w-12 h-12 text-surface-400"
        />
      </div>
      <Text type="h3" className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
        {title}
      </Text>
      <Text type="p" className="text-surface-600 dark:text-surface-400 mb-6">
        {description}
      </Text>
      {type === 'active' && !searchQuery && (
        <Button
          onClick={onCreateTask}
          className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium"
          iconName="Plus"
        >
          Create Task
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;