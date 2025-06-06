import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Plus, Search, Filter, Calendar, Users, ArrowUpDown, Edit2, Trash2, X } from 'lucide-react'
import Button from '../components/atoms/Button'
import Input from '../components/atoms/Input'
import Select from '../components/atoms/Select'
import Label from '../components/atoms/Label'
import Card from '../components/atoms/Card'
import Badge from '../components/atoms/Badge'
import { projectService } from '../services'

const Projects = () => {
  // State management
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create' or 'edit'
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'planning',
    assigned_users: []
  })

  // Load projects on component mount
  useEffect(() => {
    loadProjects()
  }, [])

  // Filter and sort projects when dependencies change
  useEffect(() => {
    filterAndSortProjects()
  }, [projects, searchTerm, statusFilter, sortBy, sortOrder])

  const loadProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await projectService.getAll()
      setProjects(data)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProjects = async () => {
    try {
      const params = {
        search: searchTerm,
        status: statusFilter,
        sortBy,
        sortOrder
      }
      const data = await projectService.getAll(params)
      setFilteredProjects(data)
    } catch (err) {
      console.error('Error filtering projects:', err)
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'planning': 'bg-blue-100 text-blue-800',
      'in progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'on hold': 'bg-orange-100 text-orange-800',
      'cancelled': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString()
  }

  const openModal = (mode, project = null) => {
    setModalMode(mode)
    if (mode === 'edit' && project) {
      setFormData({
        name: project.name,
        description: project.description,
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        status: project.status,
        assigned_users: project.assigned_users || []
      })
    } else {
      setFormData({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'planning',
        assigned_users: []
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setFormData({
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      status: 'planning',
      assigned_users: []
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (modalMode === 'create') {
        await projectService.create(formData)
        toast.success('Project created successfully!')
      } else {
        await projectService.update(selectedProject.id, formData)
        toast.success('Project updated successfully!')
      }
      
      closeModal()
      loadProjects()
      
      // Refresh selected project if it was being edited
      if (modalMode === 'edit' && selectedProject) {
        const updatedProject = await projectService.getById(selectedProject.id)
        setSelectedProject(updatedProject)
      }
    } catch (err) {
      toast.error(err.message || 'Operation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (project) => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      setLoading(true)
      try {
        await projectService.delete(project.id)
        toast.success('Project deleted successfully!')
        loadProjects()
        if (selectedProject && selectedProject.id === project.id) {
          setSelectedProject(null)
        }
      } catch (err) {
        toast.error(err.message || 'Failed to delete project')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleRowClick = async (project) => {
    try {
      const projectDetails = await projectService.getById(project.id)
      setSelectedProject(projectDetails)
    } catch (err) {
      toast.error('Failed to load project details')
    }
  }

  if (loading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Projects</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-2">
            Manage and track your projects
          </p>
        </div>
        <Button
          onClick={() => openModal('create')}
          className="flex items-center gap-2"
          disabled={loading}
        >
          <Plus size={20} />
          Add Project
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={20} />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-w-[150px]"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}
            
            {filteredProjects.length === 0 ? (
              <div className="p-8 text-center text-surface-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No projects match your filters' 
                  : 'No projects yet. Create your first project!'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface-50 dark:bg-surface-800">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center gap-2">
                          Name
                          <ArrowUpDown size={14} />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center gap-2">
                          Status
                          <ArrowUpDown size={14} />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700"
                        onClick={() => handleSort('start_date')}
                      >
                        <div className="flex items-center gap-2">
                          Start Date
                          <ArrowUpDown size={14} />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700"
                        onClick={() => handleSort('end_date')}
                      >
                        <div className="flex items-center gap-2">
                          End Date
                          <ArrowUpDown size={14} />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-surface-900 divide-y divide-surface-200 dark:divide-surface-700">
                    {filteredProjects.map((project) => (
                      <tr
                        key={project.id}
                        className="hover:bg-surface-50 dark:hover:bg-surface-800 cursor-pointer"
                        onClick={() => handleRowClick(project)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-surface-900 dark:text-white">
                            {project.name}
                          </div>
                          <div className="text-sm text-surface-500 truncate max-w-xs">
                            {project.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500">
                          {formatDate(project.start_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500">
                          {formatDate(project.end_date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Project Details */}
        <div>
          {selectedProject ? (
            <Card className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                  Project Details
                </h3>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-surface-400 hover:text-surface-600"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-surface-900 dark:text-white">
                    {selectedProject.name}
                  </h4>
                  <Badge className={getStatusColor(selectedProject.status)}>
                    {selectedProject.status}
                  </Badge>
                </div>
                
                <div>
                  <Label className="text-sm text-surface-600 dark:text-surface-400">
                    Description
                  </Label>
                  <p className="text-surface-900 dark:text-white mt-1">
                    {selectedProject.description || 'No description provided'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-surface-600 dark:text-surface-400">
                      Start Date
                    </Label>
                    <p className="text-surface-900 dark:text-white">
                      {formatDate(selectedProject.start_date)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-surface-600 dark:text-surface-400">
                      End Date
                    </Label>
                    <p className="text-surface-900 dark:text-white">
                      {formatDate(selectedProject.end_date)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-surface-600 dark:text-surface-400">
                    Assigned Users ({selectedProject.assigned_users?.length || 0})
                  </Label>
                  <div className="mt-2">
                    {selectedProject.assigned_users?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.assigned_users.map((userId, index) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800">
                            {userId}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-surface-500">No users assigned</p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => openModal('edit', selectedProject)}
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Edit2 size={16} />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(selectedProject)}
                    variant="danger"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <div className="text-center text-surface-500">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p>Select a project to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                {modalMode === 'create' ? 'Create Project' : 'Edit Project'}
              </h3>
              <button
                onClick={closeModal}
                className="text-surface-400 hover:text-surface-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter project name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter project description"
                  rows="3"
                  className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="planning">Planning</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on hold">On Hold</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading || !formData.name.trim()}
                  className="flex-1"
                >
                  {loading ? 'Saving...' : modalMode === 'create' ? 'Create Project' : 'Update Project'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeModal}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Projects