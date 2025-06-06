const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-200 dark:border-surface-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;