// ApperClient service for projects with database operations
import { toast } from 'react-toastify';

// Initialize ApperClient
const initApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const projectService = {
  // Get all projects
  getAll: async (params = {}) => {
    try {
      const apperClient = initApperClient();
      const tableName = 'Project';
      
      // Include all fields for display
      const queryParams = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
                'ProjectName', 'Description', 'StartDate', 'EndDate', 'Status', 'AssignedTeamMembers'],
        orderBy: [
          {
            fieldName: 'CreatedOn',
            SortType: 'DESC'
          }
        ],
        pagingInfo: {
          limit: params.limit || 50,
          offset: params.offset || 0
        },
        ...params
      };

      const response = await apperClient.fetchRecords(tableName, queryParams);
      
      if (!response?.data) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
      return [];
    }
  },

  // Get project by ID
  getById: async (id) => {
    try {
      const apperClient = initApperClient();
      const tableName = 'Project';
      
      const params = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
                'ProjectName', 'Description', 'StartDate', 'EndDate', 'Status', 'AssignedTeamMembers']
      };

      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response?.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      toast.error('Failed to load project');
      return null;
    }
  },

  // Create new project
  create: async (projectData) => {
    try {
      const apperClient = initApperClient();
      const tableName = 'Project';
      
      // Only include Updateable fields
      const params = {
        records: [
          {
            Name: projectData.Name || projectData.ProjectName,
            Tags: projectData.Tags,
            Owner: projectData.Owner,
            ProjectName: projectData.ProjectName,
            Description: projectData.Description,
            StartDate: projectData.StartDate,
            EndDate: projectData.EndDate,
            Status: projectData.Status || 'Not Started',
            AssignedTeamMembers: projectData.AssignedTeamMembers
          }
        ]
      };

      const response = await apperClient.createRecord(tableName, params);
      
      if (response?.success && response.results?.[0]?.success) {
        toast.success('Project created successfully');
        return response.results[0].data;
      } else {
        const error = response.results?.[0]?.errors?.[0]?.message || 'Failed to create project';
        toast.error(error);
        throw new Error(error);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error.message || 'Failed to create project');
      throw error;
    }
  },

  // Update existing project
  update: async (id, projectData) => {
    try {
      const apperClient = initApperClient();
      const tableName = 'Project';
      
      // Only include Updateable fields plus Id
      const params = {
        records: [
          {
            Id: id,
            Name: projectData.Name || projectData.ProjectName,
            Tags: projectData.Tags,
            Owner: projectData.Owner,
            ProjectName: projectData.ProjectName,
            Description: projectData.Description,
            StartDate: projectData.StartDate,
            EndDate: projectData.EndDate,
            Status: projectData.Status,
            AssignedTeamMembers: projectData.AssignedTeamMembers
          }
        ]
      };

      const response = await apperClient.updateRecord(tableName, params);
      
      if (response?.success && response.results?.[0]?.success) {
        toast.success('Project updated successfully');
        return response.results[0].data;
      } else {
        const error = response.results?.[0]?.message || 'Failed to update project';
        toast.error(error);
        throw new Error(error);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error(error.message || 'Failed to update project');
      throw error;
    }
  },

  // Delete project
  delete: async (id) => {
    try {
      const apperClient = initApperClient();
      const tableName = 'Project';
      
      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord(tableName, params);
      
      if (response?.success && response.results?.[0]?.success) {
        toast.success('Project deleted successfully');
        return true;
      } else {
        const error = response.results?.[0]?.message || 'Failed to delete project';
        toast.error(error);
        throw new Error(error);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(error.message || 'Failed to delete project');
      throw error;
    }
  },

  // Search projects
  search: async (query) => {
    try {
      const apperClient = initApperClient();
      const tableName = 'Project';
      
      const queryParams = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
                'ProjectName', 'Description', 'StartDate', 'EndDate', 'Status', 'AssignedTeamMembers'],
        where: [
          {
            fieldName: 'ProjectName',
            operator: 'Contains',
            values: [query]
          }
        ],
        orderBy: [
          {
            fieldName: 'CreatedOn',
            SortType: 'DESC'
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, queryParams);
      
      if (!response?.data) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error('Error searching projects:', error);
      toast.error('Failed to search projects');
      return [];
    }
  },

  // Get projects by status
  getByStatus: async (status) => {
    try {
      const apperClient = initApperClient();
      const tableName = 'Project';
      
      const queryParams = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
                'ProjectName', 'Description', 'StartDate', 'EndDate', 'Status', 'AssignedTeamMembers'],
        where: [
          {
            fieldName: 'Status',
            operator: 'ExactMatch',
            values: [status]
          }
        ],
        orderBy: [
          {
            fieldName: 'CreatedOn',
            SortType: 'DESC'
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, queryParams);
      
      if (!response?.data) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching projects by status:', error);
      toast.error('Failed to load projects');
      return [];
    }
  }
};

export default projectService;