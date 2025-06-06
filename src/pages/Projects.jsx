import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Search, Plus, Filter, Calendar, Users, BarChart3, Edit, Trash2 } from 'lucide-react';
import AppHeader from '../components/organisms/AppHeader';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Badge from '../components/atoms/Badge';
import { projectService } from '../services/api/projectService';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load projects
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getAll();
      setProjects(data || []);
      setFilteredProjects(data || []);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Failed to load projects. Please try again.');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  // Filter projects based on search and status
  useEffect(() => {
    let filtered = [...(projects || [])];

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project?.ProjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project?.Description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(project => project?.Status === selectedStatus);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedStatus]);

  const handleCreateProject = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData);
      if (newProject) {
        setProjects(prev => [newProject, ...(prev || [])]);
        setIsCreateModalOpen(false);
        toast.success('Project created successfully');
      }
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project. Please try again.');
      toast.error('Failed to create project');
    }
  };

  const handleUpdateProject = async (projectData) => {
    try {
      if (!editingProject?.Id) return;
      
      const updatedProject = await projectService.update(editingProject.Id, projectData);
      if (updatedProject) {
        setProjects(prev => (prev || []).map(project =>
          project.Id === editingProject.Id ? updatedProject : project
        ));
        setEditingProject(null);
        setIsCreateModalOpen(false);
        toast.success('Project updated successfully');
      }
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Failed to update project. Please try again.');
      toast.error('Failed to update project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const success = await projectService.delete(projectId);
      if (success) {
        setProjects(prev => (prev || []).filter(project => project.Id !== projectId));
        toast.success('Project deleted successfully');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project. Please try again.');
      toast.error('Failed to delete project');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-green-100 text-green-800';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setIsCreateModalOpen(true);
  };

  const closeModal = () => {
    setEditingProject(null);
    setIsCreateModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <AppHeader />
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <AppHeader />
        <div className="p-8">
          <div className="text-center text-red-600 dark:text-red-400">
            {error}
            <button
              onClick={loadProjects}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <AppHeader />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-4 sm:mb-0">
            Projects
          </h1>
          <Button
            onClick={openCreateModal}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-surface-300 rounded-md bg-white dark:bg-surface-800 dark:border-surface-600"
            >
              <option value="">All Status</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects?.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-surface-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">
              No projects found
            </h3>
            <p className="text-surface-600 dark:text-surface-400 mb-4">
              {searchTerm || selectedStatus 
                ? "Try adjusting your search or filters" 
                : "Get started by creating your first project"}
            </p>
            <Button onClick={openCreateModal}>
              Create Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects?.map((project) => (
              <ProjectCard
                key={project.Id}
                project={project}
                onEdit={() => openEditModal(project)}
                onDelete={() => handleDeleteProject(project.Id)}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        )}
      </div>

      {/* Project Form Modal */}
      {isCreateModalOpen && (
        <ProjectFormModal
          project={editingProject}
          onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project, onEdit, onDelete, getStatusColor }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-surface-800 rounded-lg shadow-card hover:shadow-lg transition-all duration-200"
    >
      <Card className="p-6 h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
              {project?.ProjectName || project?.Name}
            </h3>
            <Badge className={getStatusColor(project?.Status)}>
              {project?.Status}
            </Badge>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 text-surface-600 hover:text-primary hover:bg-surface-100 rounded-md transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-surface-600 hover:text-red-600 hover:bg-surface-100 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-surface-600 dark:text-surface-400 text-sm mb-4 line-clamp-2">
          {project?.Description || 'No description provided'}
        </p>

        <div className="space-y-2 text-sm">
          {project?.StartDate && (
            <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
              <Calendar className="w-4 h-4" />
              <span>Start: {new Date(project.StartDate).toLocaleDateString()}</span>
            </div>
          )}
          
          {project?.EndDate && (
            <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
              <Calendar className="w-4 h-4" />
              <span>End: {new Date(project.EndDate).toLocaleDateString()}</span>
            </div>
          )}

          {project?.AssignedTeamMembers && (
            <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
              <Users className="w-4 h-4" />
              <span>Team Members</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

// Project Form Modal Component
const ProjectFormModal = ({ project, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    ProjectName: project?.ProjectName || '',
    Description: project?.Description || '',
    StartDate: project?.StartDate || '',
    EndDate: project?.EndDate || '',
    Status: project?.Status || 'Not Started',
    Tags: project?.Tags || '',
    Owner: project?.Owner || '',
    AssignedTeamMembers: project?.AssignedTeamMembers || ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-surface-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-4">
            {project ? 'Edit Project' : 'Create Project'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Project Name *
              </label>
              <Input
                type="text"
                name="ProjectName"
                value={formData.ProjectName}
                onChange={handleChange}
                required
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Description
              </label>
              <textarea
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                rows="3"
                placeholder="Enter project description"
                className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-surface-700 dark:border-surface-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Start Date
                </label>
                <Input
                  type="date"
                  name="StartDate"
                  value={formData.StartDate}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  End Date
                </label>
                <Input
                  type="date"
                  name="EndDate"
                  value={formData.EndDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Status
              </label>
              <select
                name="Status"
                value={formData.Status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-surface-700 dark:border-surface-600"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Tags
              </label>
              <Input
                type="text"
                name="Tags"
                value={formData.Tags}
                onChange={handleChange}
                placeholder="Enter tags (comma separated)"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.ProjectName.trim()}
                className="flex-1"
              >
                {loading ? 'Saving...' : (project ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Projects;