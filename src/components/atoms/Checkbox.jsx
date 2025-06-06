import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ checked, onChange, className = '' }) => {
  return (
    <button
      onClick={onChange}
      className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
        checked
          ? 'bg-green-500 border-green-500'
          : 'border-surface-300 dark:border-surface-600 hover:border-primary'
      } ${className}`}
    >
      {checked && <ApperIcon name="Check" className="w-3 h-3 text-white" />}
    </button>
  );
};

export default Checkbox;