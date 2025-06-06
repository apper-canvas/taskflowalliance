const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  icon: Icon,
  iconName,
  ...props
}) => {
  const inputClasses = `w-full px-4 py-3 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${className}`;

  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${inputClasses} ${Icon ? 'pl-10' : ''}`}
        {...props}
      />
    </div>
  );
};

export default Input;