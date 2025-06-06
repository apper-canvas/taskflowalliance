import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

const TaskFormModal = ({
  showTaskForm,
  editingTask,
  newTask,
  setNewTask,
  categories,
  handleCreateTask,
  resetForm
}) => {
  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const categoryOptions = [
    { value: '', label: 'No category' },
    ...(categories?.map(cat => ({ value: cat.id, label: cat.name })) || [])
  ];

  return (
    <AnimatePresence>
      {showTaskForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && resetForm()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md glassmorphism"
          >
            <div className="flex items-center justify-between mb-6">
              <Text type="h3" className="text-xl font-bold text-surface-900 dark:text-white">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </Text>
              <Button
                onClick={resetForm}
                className="p-2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                iconName="X"
              />
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <FormField label="Title" required>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title..."
                />
              </FormField>

              <FormField label="Description">
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                  placeholder="Enter task description..."
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Priority">
                  <Select
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                    options={priorityOptions}
                  />
                </FormField>

                <FormField label="Category">
                  <Select
                    value={newTask.category}
                    onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                    options={categoryOptions}
                  />
                </FormField>
              </div>

              <FormField label="Due Date">
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </FormField>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 text-surface-700 dark:text-surface-300 bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 rounded-xl font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium"
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskFormModal;