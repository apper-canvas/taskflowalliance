import Button from '@/components/atoms/Button';

const TaskCardActions = ({
  showArchived,
  onRestore,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
  isCompleted
}) => {
  return (
    <div className="flex items-center space-x-2 ml-4">
      {showArchived ? (
        <Button
          onClick={onRestore}
          className="p-2 text-surface-600 dark:text-surface-400 hover:text-primary hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg"
          title="Restore task"
          iconName="RotateCcw"
        />
      ) : (
        <>
          <Button
            onClick={onEdit}
            className="p-2 text-surface-600 dark:text-surface-400 hover:text-primary hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg"
            title="Edit task"
            iconName="Edit2"
          />

          <Button
            onClick={onDuplicate}
            className="p-2 text-surface-600 dark:text-surface-400 hover:text-primary hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg"
            title="Duplicate task"
            iconName="Copy"
          />

          {isCompleted && (
            <Button
              onClick={onArchive}
              className="p-2 text-surface-600 dark:text-surface-400 hover:text-primary hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg"
              title="Archive task"
              iconName="Archive"
            />
          )}
        </>
      )}

      <Button
        onClick={onDelete}
        className="p-2 text-surface-600 dark:text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
        title="Delete task"
        iconName="Trash2"
      />
    </div>
  );
};

export default TaskCardActions;