import projectsData from '../mockData/projects.json'

// Helper function for realistic API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory data store (persists during session)
let projects = [...projectsData]

// Generate new ID for created projects
const generateId = () => {
  const maxId = projects.reduce((max, project) => Math.max(max, project.id), 0)
  return maxId + 1
}

// Validate project data
const validateProject = (project) => {
  const errors = []
  
  if (!project.name || project.name.trim().length === 0) {
    errors.push('Project name is required')
  }
  
  if (project.start_date && !isValidDate(project.start_date)) {
    errors.push('Start date must be in YYYY-MM-DD format')
  }
  
  if (project.end_date && !isValidDate(project.end_date)) {
    errors.push('End date must be in YYYY-MM-DD format')
  }
  
  if (project.start_date && project.end_date && new Date(project.start_date) > new Date(project.end_date)) {
    errors.push('End date must be after start date')
  }
  
  const validStatuses = ['planning', 'in progress', 'completed', 'on hold', 'cancelled']
  if (project.status && !validStatuses.includes(project.status)) {
    errors.push('Status must be one of: planning, in progress, completed, on hold, cancelled')
  }
  
  if (project.assigned_users && !Array.isArray(project.assigned_users)) {
    errors.push('Assigned users must be an array')
  }
  
  return errors
}

// Helper function to validate date format
const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(dateString)) return false
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date)
}

// Service methods
const projectService = {
  // Get all projects with optional filtering and sorting
  async getAll(params = {}) {
    await delay(300)
    
    try {
      let filteredProjects = [...projects]
      
      // Apply status filter
      if (params.status && params.status !== 'all') {
        filteredProjects = filteredProjects.filter(project => project.status === params.status)
      }
      
      // Apply search filter
      if (params.search) {
        const searchTerm = params.search.toLowerCase()
        filteredProjects = filteredProjects.filter(project =>
          project.name.toLowerCase().includes(searchTerm) ||
          project.description.toLowerCase().includes(searchTerm)
        )
      }
      
      // Apply sorting
      if (params.sortBy) {
        filteredProjects.sort((a, b) => {
          let aValue = a[params.sortBy]
          let bValue = b[params.sortBy]
          
          // Handle null values
          if (aValue === null && bValue === null) return 0
          if (aValue === null) return 1
          if (bValue === null) return -1
          
          // Handle date sorting
          if (params.sortBy === 'start_date' || params.sortBy === 'end_date') {
            aValue = new Date(aValue)
            bValue = new Date(bValue)
          }
          
          // Handle string sorting
          if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase()
            bValue = bValue.toLowerCase()
          }
          
          if (params.sortOrder === 'desc') {
            return bValue > aValue ? 1 : bValue < aValue ? -1 : 0
          } else {
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
          }
        })
      }
      
      return filteredProjects
    } catch (error) {
      console.error('Error fetching projects:', error)
      throw new Error('Failed to fetch projects')
    }
  },

  // Get project by ID
  async getById(id) {
    await delay(200)
    
    try {
      const project = projects.find(p => p.id === parseInt(id))
      if (!project) {
        throw new Error('Project not found')
      }
      return { ...project }
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error)
      throw error
    }
  },

  // Create new project
  async create(projectData) {
    await delay(400)
    
    try {
      // Validate project data
      const validationErrors = validateProject(projectData)
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '))
      }
      
      const newProject = {
        id: generateId(),
        name: projectData.name.trim(),
        description: projectData.description || '',
        start_date: projectData.start_date || null,
        end_date: projectData.end_date || null,
        status: projectData.status || 'planning',
        assigned_users: projectData.assigned_users || []
      }
      
      projects.push(newProject)
      return { ...newProject }
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  },

  // Update existing project
  async update(id, projectData) {
    await delay(350)
    
    try {
      const projectIndex = projects.findIndex(p => p.id === parseInt(id))
      if (projectIndex === -1) {
        throw new Error('Project not found')
      }
      
      // Validate updated project data
      const validationErrors = validateProject(projectData)
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '))
      }
      
      const updatedProject = {
        ...projects[projectIndex],
        ...projectData,
        id: parseInt(id) // Preserve ID
      }
      
      projects[projectIndex] = updatedProject
      return { ...updatedProject }
    } catch (error) {
      console.error(`Error updating project with ID ${id}:`, error)
      throw error
    }
  },

  // Delete project
  async delete(id) {
    await delay(250)
    
    try {
      const projectIndex = projects.findIndex(p => p.id === parseInt(id))
      if (projectIndex === -1) {
        throw new Error('Project not found')
      }
      
      projects.splice(projectIndex, 1)
      return true
    } catch (error) {
      console.error(`Error deleting project with ID ${id}:`, error)
      throw error
    }
  }
}

export default projectService