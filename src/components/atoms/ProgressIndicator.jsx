const ProgressIndicator = ({ percentage, className = '' }) => {
  return (
    <div className={`w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2 ${className}`}>
      <div
        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressIndicator;