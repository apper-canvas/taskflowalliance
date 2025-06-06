import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import AppHeader from '../organisms/AppHeader';
import TaskStatsCard from '../organisms/TaskStatsCard';
import QuickActions from '../organisms/QuickActions';
import TaskList from '../organisms/TaskList';
import TaskFilters from '../organisms/TaskFilters';
import TaskFormModal from '../organisms/TaskFormModal';
import EmptyState from '../organisms/EmptyState';
import Card from '../atoms/Card';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import CategoryFilterItem from '../molecules/CategoryFilterItem';
import { taskService } from '../../services/api/taskService';
import { categoryService } from '../../services/api/categoryService';
const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    status: '',
    priority: '',
    category: ''
  });
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    dueDate: '',
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Load tasks and categories
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      
      setTasks(tasksData || []);
      setCategories(categoriesData || []);
      setFilteredTasks(tasksData || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

// Filter tasks based on selected filters
  useEffect(() => {
    let filtered = [...(tasks || [])];

    if (selectedFilters.status) {
      filtered = filtered.filter(task => task?.status === selectedFilters.status);
    }

    if (selectedFilters.priority) {
      filtered = filtered.filter(task => task?.priority === selectedFilters.priority);
    }

    if (selectedFilters.category) {
      filtered = filtered.filter(task => task?.category === selectedFilters.category);
    }

    setFilteredTasks(filtered);
  }, [tasks, selectedFilters]);

const handleCreateTask = async (taskData) => {
    try {
      const createdTask = await taskService.create(taskData);
      if (createdTask) {
        setTasks(prev => [createdTask, ...(prev || [])]);
        setShowTaskForm(false);
        resetForm();
        toast.success('Task created successfully');
      }
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task. Please try again.');
      toast.error('Failed to create task');
    }
  };

const handleUpdateTask = async (taskData) => {
    try {
      if (!editingTask?.id) return;
      
      const updatedTask = await taskService.update(editingTask.id, taskData);
      if (updatedTask) {
        setTasks(prev => (prev || []).map(task => 
          task.id === editingTask.id ? updatedTask : task
        ));
        setEditingTask(null);
        setShowTaskForm(false);
        resetForm();
        toast.success('Task updated successfully');
      }
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
      toast.error('Failed to update task');
    }
  };

const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      const success = await taskService.delete(taskId);
      if (success) {
        setTasks(prev => (prev || []).filter(task => task.id !== taskId));
        toast.success('Task deleted successfully');
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
      toast.error('Failed to delete task');
    }
  };

const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const task = tasks?.find(t => t.id === taskId);
      if (!task) return;

      const updateData = {
        ...task,
        status: newStatus,
        completedAt: newStatus === 'completed' ? new Date().toISOString() : null
      };

      const updatedTask = await taskService.update(taskId, updateData);
      if (updatedTask) {
        setTasks(prev => (prev || []).map(t => 
          t.id === taskId ? updatedTask : t
        ));
        toast.success(`Task status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status. Please try again.');
      toast.error('Failed to update task status');
    }
  };

  const handleArchiveTask = async (taskId, archive = true) => {
    try {
      const task = tasks?.find(t => t.id === taskId);
      if (!task) return;

      const updateData = {
        ...task,
        isArchived: archive
      };

      const updatedTask = await taskService.update(taskId, updateData);
      if (updatedTask) {
        setTasks(prev => (prev || []).map(t => 
          t.id === taskId ? updatedTask : t
        ));
        toast.success(`Task ${archive ? 'archived' : 'restored'} successfully`);
      }
    } catch (err) {
      console.error('Error archiving task:', err);
      setError(`Failed to ${archive ? 'archive' : 'restore'} task. Please try again.`);
      toast.error(`Failed to ${archive ? 'archive' : 'restore'} task`);
    }
  };

const openTaskModal = (task = null) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(false);
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

  const getFilteredTasks = () => {
    return tasks?.filter((task) => {
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
  };

  const finalFilteredTasks = getFilteredTasks();

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

{finalFilteredTasks.length === 0 ? (
              <EmptyState
                type={showArchived ? 'archived' : 'active'}
                searchQuery={searchQuery}
                onCreateTask={() => setShowTaskForm(true)}
              />
            ) : (
<TaskList
                filteredTasks={finalFilteredTasks}
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