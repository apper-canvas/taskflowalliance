import ApperIcon from '@/components/ApperIcon';

const Button = ({
  children,
  onClick,
  className = '',
  iconName,
  type = 'button',
  title,
  disabled = false,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`transition-colors duration-200 ${className}`}
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