import ApperIcon from '@/components/ApperIcon';

const Button = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  iconName,
  type = 'button',
  title,
  disabled = false,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      case 'primary':
      default:
        return 'bg-primary text-white hover:bg-primary-dark focus:ring-primary';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'lg':
        return 'px-6 py-4 text-lg';
      case 'md':
      default:
        return 'px-4 py-3';
    }
  };

  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      title={title}
      disabled={disabled}
      {...props}
    >
      {iconName && <ApperIcon name={iconName} className="w-5 h-5" />}
      {children}
    </button>
  );
};

export default Button;