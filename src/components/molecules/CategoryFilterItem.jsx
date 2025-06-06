import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const CategoryFilterItem = ({ category, isSelected, onClick, taskCount }) => {
  return (
    <Button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-xl ${
        isSelected
          ? 'bg-primary text-white'
          : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
      }`}
    >
      <div className="flex items-center space-x-3">
        {category.id !== 'all' && (
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: category.color }}
          ></div>
        )}
        <Text type="span">{category.name}</Text>
      </div>
      <Text type="span" className="text-sm">{taskCount}</Text>
    </Button>
  );
};

export default CategoryFilterItem;