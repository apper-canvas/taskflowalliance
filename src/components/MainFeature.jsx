import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import ApperIcon from './ApperIcon'
import taskService from '../services/api/taskService'
import categoryService from '../services/api/categoryService'

const MainFeature = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    dueDate: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ])
      setTasks(tasksData || [])
      setCategories(categoriesData || [])
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) {
      toast.error('Task title is required')
      return
    }

    try {
      const taskData = {
        ...newTask,
        status: 'todo',
        isArchived: false
      }
      
      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.id, taskData)
        setTasks(prev => prev.map(task => task.id === editingTask.id ? updatedTask : task))
        toast.success('Task updated successfully')
      } else {
        const createdTask = await taskService.create(taskData)
        setTasks(prev => [createdTask, ...prev])
        toast.success('Task created successfully')
      }
      
      resetForm()
    } catch (err) {
      toast.error('Failed to save task')
    }
  }

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const updateData = { 
        status: newStatus,
        ...(newStatus === 'completed' ? { completedAt: new Date().toISOString() } : {})
      }
      const updatedTask = await taskService.update(taskId, updateData)
      setTasks(prev => prev.map(task => task.id === taskId ? updatedTask : task))
      toast.success(`Task ${newStatus === 'completed' ? 'completed' : 'updated'}`)
    } catch (err) {
      toast.error('Failed to update task status')
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(task => task.id !== taskId))
      toast.success('Task deleted successfully')
    } catch (err) {
      toast.error('Failed to delete task')
    }
  }

  const handleArchiveTask = async (taskId, archive = true) => {
    try {
      const updatedTask = await taskService.update(taskId, { isArchived: archive })
      setTasks(prev => prev.map(task => task.id === taskId ? updatedTask : task))
      toast.success(`Task ${archive ? 'archived' : 'restored'}`)
    } catch (err) {
      toast.error(`Failed to ${archive ? 'archive' : 'restore'} task`)
    }
  }

  const resetForm = () => {
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      dueDate: ''
    })
    setShowTaskForm(false)
    setEditingTask(null)
  }

  const startEditTask = (task) => {
    setEditingTask(task)
    setNewTask({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      category: task.category || '',
      dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
    })
    setShowTaskForm(true)
  }

  const duplicateTask = async (task) => {
    try {
      const duplicatedTask = await taskService.create({
        ...task,
        title: `${task.title} (Copy)`,
        id: undefined,
        createdAt: undefined,
        completedAt: undefined,
        status: 'todo'
      })
      setTasks(prev => [duplicatedTask, ...prev])
      toast.success('Task duplicated successfully')
    } catch (err) {
      toast.error('Failed to duplicate task')
    }
  }

  const filteredTasks = tasks?.filter(task => {
    if (showArchived !== task.isArchived) return false
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false
    if (selectedStatus !== 'all' && task.status !== selectedStatus) return false
    if (searchQuery && !task.title?.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !task.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  }) || []

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-accent'
      case 'low': return 'bg-green-500'
      default: return 'bg-surface-400'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400'
      case 'in-progress': return 'text-accent dark:text-accent'
      case 'todo': return 'text-surface-600 dark:text-surface-400'
      default: return 'text-surface-600 dark:text-surface-400'
    }
  }

  const formatDueDate = (date) => {
    if (!date) return ''
    const taskDate = new Date(date)
    if (isToday(taskDate)) return 'Today'
    if (isTomorrow(taskDate)) return 'Tomorrow'
    return format(taskDate, 'MMM dd')
  }

  const getTaskStats = () => {
    const activeTasks = tasks?.filter(task => !task.isArchived) || []
    const completed = activeTasks.filter(task => task.status === 'completed').length
    const total = activeTasks.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { completed, total, percentage }
  }

  const stats = getTaskStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Stats Card */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-200 dark:border-surface-700">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-surface-600 dark:text-surface-400">Completed</span>
                <span className="font-semibold text-surface-900 dark:text-white">{stats.completed}/{stats.total}</span>
              </div>
              <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.percentage}%` }}
                ></div>
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-primary">{stats.percentage}%</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-200 dark:border-surface-700">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Categories</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors duration-200 ${
                  selectedCategory === 'all' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                }`}
              >
                <span>All Tasks</span>
                <span className="text-sm">{tasks?.filter(t => !t.isArchived).length || 0}</span>
              </button>
              {categories?.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors duration-200 ${
                    selectedCategory === category.id 
                      ? 'bg-primary text-white' 
                      : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span>{category.name}</span>
                  </div>
                  <span className="text-sm">
                    {tasks?.filter(t => t.category === category.id && !t.isArchived).length || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-200 dark:border-surface-700">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowArchived(!showArchived)}
                className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 transition-colors duration-200"
              >
                <ApperIcon name={showArchived ? "Eye" : "Archive"} className="w-5 h-5" />
                <span>{showArchived ? 'View Active Tasks' : 'View Archive'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
                {showArchived ? 'Archived Tasks' : 'Your Tasks'}
              </h2>
              <p className="text-surface-600 dark:text-surface-400">
                {showArchived ? 'Completed and archived tasks' : 'Organize and track your daily activities'}
              </p>
            </div>
            
            {!showArchived && (
              <button
                onClick={() => setShowTaskForm(true)}
                className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 shadow-card"
              >
                <ApperIcon name="Plus" className="w-5 h-5" />
                <span>Add Task</span>
              </button>
            )}
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
              />
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Task List */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredTasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ApperIcon 
                      name={showArchived ? "Archive" : searchQuery ? "Search" : "CheckSquare"} 
                      className="w-12 h-12 text-surface-400" 
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                    {showArchived ? 'No archived tasks' : searchQuery ? 'No tasks found' : 'No tasks yet'}
                  </h3>
                  <p className="text-surface-600 dark:text-surface-400 mb-6">
                    {showArchived 
                      ? 'Complete some tasks to see them here' 
                      : searchQuery 
                        ? 'Try adjusting your search or filters'
                        : 'Create your first task to get started'
                    }
                  </p>
                  {!showArchived && !searchQuery && (
                    <button
                      onClick={() => setShowTaskForm(true)}
                      className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
                    >
                      <ApperIcon name="Plus" className="w-5 h-5" />
                      <span>Create Task</span>
                    </button>
                  )}
                </motion.div>
              ) : (
                filteredTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-200 dark:border-surface-700 hover:shadow-soft transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start space-x-3">
                          {!showArchived && (
                            <button
                              onClick={() => handleUpdateTaskStatus(
                                task.id, 
                                task.status === 'completed' ? 'todo' : 'completed'
                              )}
                              className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                                task.status === 'completed'
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-surface-300 dark:border-surface-600 hover:border-primary'
                              }`}
                            >
                              {task.status === 'completed' && (
                                <ApperIcon name="Check" className="w-3 h-3 text-white" />
                              )}
                            </button>
                          )}
                          
                          <div className="flex-1">
                            <h3 className={`font-semibold text-surface-900 dark:text-white ${
                              task.status === 'completed' ? 'line-through opacity-75' : ''
                            }`}>
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className={`text-sm text-surface-600 dark:text-surface-400 mt-1 ${
                                task.status === 'completed' ? 'line-through opacity-75' : ''
                              }`}>
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          {/* Priority Badge */}
                          <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium text-white ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>

                          {/* Status Badge */}
                          <span className={`text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status?.replace('-', ' ')}
                          </span>

                          {/* Category Badge */}
                          {task.category && (
                            <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300">
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ 
                                  backgroundColor: categories?.find(c => c.id === task.category)?.color || '#64748B'
                                }}
                              ></div>
                              <span>{categories?.find(c => c.id === task.category)?.name || 'Unknown'}</span>
                            </span>
                          )}

                          {/* Due Date Badge */}
                          {task.dueDate && (
                            <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                              isPast(new Date(task.dueDate)) && task.status !== 'completed'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            }`}>
                              <ApperIcon name="Calendar" className="w-3 h-3 inline mr-1" />
                              {formatDueDate(task.dueDate)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 ml-4">
                        {showArchived ? (
                          <button
                            onClick={() => handleArchiveTask(task.id, false)}
                            className="p-2 text-surface-600 dark:text-surface-400 hover:text-primary hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200"
                            title="Restore task"
                          >
                            <ApperIcon name="RotateCcw" className="w-4 h-4" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditTask(task)}
                              className="p-2 text-surface-600 dark:text-surface-400 hover:text-primary hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200"
                              title="Edit task"
                            >
                              <ApperIcon name="Edit2" className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => duplicateTask(task)}
                              className="p-2 text-surface-600 dark:text-surface-400 hover:text-primary hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200"
                              title="Duplicate task"
                            >
                              <ApperIcon name="Copy" className="w-4 h-4" />
                            </button>

                            {task.status === 'completed' && (
                              <button
                                onClick={() => handleArchiveTask(task.id, true)}
                                className="p-2 text-surface-600 dark:text-surface-400 hover:text-primary hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200"
                                title="Archive task"
                              >
                                <ApperIcon name="Archive" className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                        
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 text-surface-600 dark:text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                          title="Delete task"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
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
                <h3 className="text-xl font-bold text-surface-900 dark:text-white">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors duration-200"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                    placeholder="Enter task title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                    placeholder="Enter task description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Category
                    </label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                    >
                      <option value="">No category</option>
                      {categories?.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-3 text-surface-700 dark:text-surface-300 bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 rounded-xl font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors duration-200"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature