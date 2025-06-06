import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { 
  Home, 
  CheckSquare, 
  Folder,
  Plus, 
  Search, 
  Filter,
} from 'lucide-react'
import CategoryFilterItem from '@/components/molecules/CategoryFilterItem'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import TaskFilters from '@/components/organisms/TaskFilters'
import TaskList from '@/components/organisms/TaskList'
import EmptyState from '@/components/organisms/EmptyState'
import TaskFormModal from '@/components/organisms/TaskFormModal'
import Card from '@/components/atoms/Card'
import AppHeader from '@/components/organisms/AppHeader'
import TaskStatsCard from '@/components/organisms/TaskStatsCard'
import QuickActions from '@/components/molecules/QuickActions'
import taskService from '../../services/api/taskService'
import categoryService from '../../services/api/categoryService'
const HomePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    dueDate: '',
  });

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    document.documentElement.classList.toggle('dark', savedDarkMode);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll(),
      ]);
      setTasks(tasksData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
};

const handleCreateTask = async () => {
    try {
      const taskData = {
        ...newTask,
        status: newTask.status || 'todo', // Ensure status is set
        isArchived: newTask.isArchived || false, // Ensure isArchived is set
      };
      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.id, taskData);
        setTasks((prev) =>
          prev.map((task) => (task.id === editingTask.id ? updatedTask : task))
        );
        toast.success('Task updated successfully');
      } else {
        const createdTask = await taskService.create(taskData);
        setTasks((prev) => [createdTask, ...prev]);
        toast.success('Task created successfully');
      }

      resetForm();
    } catch (err) {
      toast.error('Failed to save task');
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const updateData = {
        status: newStatus,
        ...(newStatus === 'completed' ? { completedAt: new Date().toISOString() } : {}),
      };
      const updatedTask = await taskService.update(taskId, updateData);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );
      toast.success(`Task ${newStatus === 'completed' ? 'completed' : 'updated'}`);
    } catch (err) {
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleArchiveTask = async (taskId, archive = true) => {
    try {
      const updatedTask = await taskService.update(taskId, { isArchived: archive });
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );
      toast.success(`Task ${archive ? 'archived' : 'restored'}`);
    } catch (err) {
      toast.error(`Failed to ${archive ? 'archive' : 'restore'} task`);
    }
  };

  const resetForm = () => {
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      dueDate: '',
    });
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const startEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      category: task.category || '',
      dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
    });
    setShowTaskForm(true);
  };

  const duplicateTask = async (task) => {
    try {
      const duplicatedTask = await taskService.create({
        ...task,
        title: `${task.title} (Copy)`,
        id: undefined,
        createdAt: undefined,
        completedAt: undefined,
        status: 'todo',
      });
      setTasks((prev) => [duplicatedTask, ...prev]);
      toast.success('Task duplicated successfully');
    } catch (err) {
      toast.error('Failed to duplicate task');
    }
  };

  const filteredTasks =
    tasks?.filter((task) => {
      if (showArchived !== task.isArchived) return false;
      if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && task.status !== selectedStatus) return false;
      if (
        searchQuery &&
        !task.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    }) || [];

  const getTaskStats = () => {
    const activeTasks = tasks?.filter((task) => !task.isArchived) || [];
    const completed = activeTasks.filter((task) => task.status === 'completed').length;
    const total = activeTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors duration-200">
      <AppHeader darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            <TaskStatsCard stats={stats} />

            <Card>
              <Text type="h3" className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Categories</Text>
              <div className="space-y-2">
                <CategoryFilterItem
                  category={{ id: 'all', name: 'All Tasks' }}
                  isSelected={selectedCategory === 'all'}
                  onClick={() => setSelectedCategory('all')}
                  taskCount={tasks?.filter(t => !t.isArchived).length || 0}
                />
                {categories?.map((category) => (
                  <CategoryFilterItem
                    key={category.id}
                    category={category}
                    isSelected={selectedCategory === category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    taskCount={tasks?.filter(t => t.category === category.id && !t.isArchived).length || 0}
                  />
                ))}
              </div>
            </Card>

            <QuickActions
              showArchived={showArchived}
              onToggleArchived={() => setShowArchived(!showArchived)}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <Text type="h2" className="text-2xl font-bold text-surface-900 dark:text-white">
                  {showArchived ? 'Archived Tasks' : 'Your Tasks'}
                </Text>
                <Text type="p" className="text-surface-600 dark:text-surface-400">
                  {showArchived ? 'Completed and archived tasks' : 'Organize and track your daily activities'}
                </Text>
              </div>

              {!showArchived && (
                <Button
                  onClick={() => setShowTaskForm(true)}
                  className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium shadow-card"
                  iconName="Plus"
                >
                  Add Task
                </Button>
              )}
            </div>

            <TaskFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
            />

            {filteredTasks.length === 0 ? (
              <EmptyState
                type={showArchived ? 'archived' : 'active'}
                searchQuery={searchQuery}
                onCreateTask={() => setShowTaskForm(true)}
              />
            ) : (
              <TaskList
                filteredTasks={filteredTasks}
                showArchived={showArchived}
                categories={categories}
                handleUpdateTaskStatus={handleUpdateTaskStatus}
                startEditTask={startEditTask}
                duplicateTask={duplicateTask}
                handleArchiveTask={handleArchiveTask}
                handleDeleteTask={handleDeleteTask}
              />
            )}
          </div>
        </div>

        <TaskFormModal
          showTaskForm={showTaskForm}
          editingTask={editingTask}
          newTask={newTask}
          setNewTask={setNewTask}
          categories={categories}
          handleCreateTask={handleCreateTask}
          resetForm={resetForm}
        />
      </main>
    </div>
  );
};

export default HomePage;