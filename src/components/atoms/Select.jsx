const Select = ({ value, onChange, options = [], className = '', ...props }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`px-4 py-3 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${className}`}
      {...props}
    >
      {(options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      )) || [])}
    </select>
  );
};

export default Select;