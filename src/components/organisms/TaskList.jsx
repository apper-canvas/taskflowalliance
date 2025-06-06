import { motion, AnimatePresence } from 'framer-motion';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import Checkbox from '@/components/atoms/Checkbox';
import Text from '@/components/atoms/Text';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import TaskCardActions from '@/components/molecules/TaskCardActions';

const TaskList = ({
  filteredTasks,
  showArchived,
  categories,
  handleUpdateTaskStatus,
  startEditTask,
  duplicateTask,
  handleArchiveTask,
  handleDeleteTask,
}) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-accent';
      case 'low': return 'bg-green-500';
      default: return 'bg-surface-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400';
      case 'in-progress': return 'text-accent dark:text-accent';
      case 'todo': return 'text-surface-600 dark:text-surface-400';
      default: return 'text-surface-600 dark:text-surface-400';
    }
  };

  const formatDueDate = (date) => {
    if (!date) return '';
    const taskDate = new Date(date);
    if (isToday(taskDate)) return 'Today';
    if (isTomorrow(taskDate)) return 'Tomorrow';
    return format(taskDate, 'MMM dd');
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {filteredTasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="hover:shadow-soft transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start space-x-3">
                    {!showArchived && (
                      <Checkbox
                        checked={task.status === 'completed'}
                        onChange={() => handleUpdateTaskStatus(
                          task.id,
                          task.status === 'completed' ? 'todo' : 'completed'
                        )}
                      />
                    )}

                    <div className="flex-1">
                      <Text
                        type="h3"
                        className={`font-semibold text-surface-900 dark:text-white ${
                          task.status === 'completed' ? 'line-through opacity-75' : ''
                        }`}
                      >
                        {task.title}
                      </Text>
                      {task.description && (
                        <Text
                          type="p"
                          className={`text-sm text-surface-600 dark:text-surface-400 mt-1 ${
                            task.status === 'completed' ? 'line-through opacity-75' : ''
                          }`}
                        >
                          {task.description}
                        </Text>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>

                    <Text type="span" className={`text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status?.replace('-', ' ')}
                    </Text>

                    {task.category && (
                      <Badge className="bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 space-x-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: categories?.find(c => c.id === task.category)?.color || '#64748B'
                          }}
                        ></div>
                        <Text type="span">{categories?.find(c => c.id === task.category)?.name || 'Unknown'}</Text>
                      </Badge>
                    )}

                    {task.dueDate && (
                      <Badge className={`text-xs font-medium ${
                        isPast(new Date(task.dueDate)) && task.status !== 'completed'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        <ApperIcon name="Calendar" className="w-3 h-3 inline mr-1" />
                        {formatDueDate(task.dueDate)}
                      </Badge>
                    )}
                  </div>
                </div>

                <TaskCardActions
                  showArchived={showArchived}
                  onRestore={() => handleArchiveTask(task.id, false)}
                  onEdit={() => startEditTask(task)}
                  onDuplicate={() => duplicateTask(task)}
                  onArchive={() => handleArchiveTask(task.id, true)}
                  onDelete={() => handleDeleteTask(task.id)}
                  isCompleted={task.status === 'completed'}
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;