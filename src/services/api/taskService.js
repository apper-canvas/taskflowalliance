// ApperClient service for tasks with database operations
import { toast } from 'react-toastify';

// Initialize ApperClient
const initApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const taskService = {
  // Get all tasks
  getAll: async (params = {}) => {
    try {
      const apperClient = initApperClient();
      const tableName = 'task';
      
      // Include all fields for display
      const queryParams = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
                'title', 'description', 'priority', 'category', 'due_date', 'status', 'is_archived', 
                'completed_at', 'created_at'],
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
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
      return [];
    }
  },

  // Get task by ID
  getById: async (id) => {
    try {
      const apperClient = initApperClient();
      const tableName = 'task';
      
      const params = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
                'title', 'description', 'priority', 'category', 'due_date', 'status', 'is_archived', 
                'completed_at', 'created_at']
      };

      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response?.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      toast.error('Failed to load task');
      return null;
    }
  },

  // Create new task
  create: async (taskData) => {
    try {
      const apperClient = initApperClient();
      const tableName = 'task';
      
      // Only include Updateable fields
      const params = {
        records: [
          {
            Name: taskData.Name || taskData.title,
            Tags: taskData.Tags,
            Owner: taskData.Owner,
            title: taskData.title,
            description: taskData.description,
            priority: taskData.priority,
            category: taskData.category,
            due_date: taskData.due_date,
            status: taskData.status || 'todo',
            is_archived: taskData.is_archived || false,
            completed_at: taskData.completed_at,
            created_at: taskData.created_at || new Date().toISOString()
          }
        ]
      };

      const response = await apperClient.createRecord(tableName, params);
      
      if (response?.success && response.results?.[0]?.success) {
        toast.success('Task created successfully');
        return response.results[0].data;
      } else {
        const error = response.results?.[0]?.errors?.[0]?.message || 'Failed to create task';
        toast.error(error);
        throw new Error(error);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error(error.message || 'Failed to create task');
      throw error;
    }
  },

  // Update existing task
  update: async (id, taskData) => {
    try {
      const apperClient = initApperClient();
      const tableName = 'task';
      
      // Only include Updateable fields plus Id
      const params = {
        records: [
          {
            Id: id,
            Name: taskData.Name || taskData.title,
            Tags: taskData.Tags,
            Owner: taskData.Owner,
            title: taskData.title,
            description: taskData.description,
            priority: taskData.priority,
            category: taskData.category,
            due_date: taskData.due_date,
            status: taskData.status,
            is_archived: taskData.is_archived,
            completed_at: taskData.completed_at,
            created_at: taskData.created_at
          }
        ]
      };

      const response = await apperClient.updateRecord(tableName, params);
      
      if (response?.success && response.results?.[0]?.success) {
        toast.success('Task updated successfully');
        return response.results[0].data;
      } else {
        const error = response.results?.[0]?.message || 'Failed to update task';
        toast.error(error);
        throw new Error(error);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error(error.message || 'Failed to update task');
      throw error;
    }
  },

  // Delete task
  delete: async (id) => {
    try {
      const apperClient = initApperClient();
      const tableName = 'task';
      
      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord(tableName, params);
      
      if (response?.success && response.results?.[0]?.success) {
        toast.success('Task deleted successfully');
        return true;
      } else {
        const error = response.results?.[0]?.message || 'Failed to delete task';
        toast.error(error);
        throw new Error(error);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(error.message || 'Failed to delete task');
      throw error;
    }
  },

  // Get tasks by status
  getByStatus: async (status) => {
    try {
      const apperClient = initApperClient();
      const tableName = 'task';
      
      const queryParams = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
                'title', 'description', 'priority', 'category', 'due_date', 'status', 'is_archived', 
                'completed_at', 'created_at'],
        where: [
          {
            fieldName: 'status',
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
      console.error('Error fetching tasks by status:', error);
      toast.error('Failed to load tasks');
      return [];
    }
  },

  // Get tasks by category
  getByCategory: async (categoryId) => {
    try {
      const apperClient = initApperClient();
      const tableName = 'task';
      
      const queryParams = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
                'title', 'description', 'priority', 'category', 'due_date', 'status', 'is_archived', 
                'completed_at', 'created_at'],
        where: [
          {
            fieldName: 'category',
            operator: 'EqualTo',
            values: [categoryId]
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
      console.error('Error fetching tasks by category:', error);
      toast.error('Failed to load tasks');
      return [];
    }
  }
};