// ApperClient service for categories with database operations
import { toast } from 'react-toastify';

// Initialize ApperClient
const initApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const categoryService = {
  // Get all categories
  getAll: async (params = {}) => {
    try {
      const apperClient = initApperClient();
      const tableName = 'category';
      
      // Include all fields for display
      const queryParams = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'],
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
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
      return [];
    }
  },

  // Get category by ID
  getById: async (id) => {
    try {
      const apperClient = initApperClient();
      const tableName = 'category';
      
      const params = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy']
      };

      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response?.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      toast.error('Failed to load category');
      return null;
    }
  },

  // Create new category
  create: async (categoryData) => {
    try {
      const apperClient = initApperClient();
      const tableName = 'category';
      
      // Only include Updateable fields
      const params = {
        records: [
          {
            Name: categoryData.Name,
            Tags: categoryData.Tags,
            Owner: categoryData.Owner
          }
        ]
      };

      const response = await apperClient.createRecord(tableName, params);
      
      if (response?.success && response.results?.[0]?.success) {
        toast.success('Category created successfully');
        return response.results[0].data;
      } else {
        const error = response.results?.[0]?.errors?.[0]?.message || 'Failed to create category';
        toast.error(error);
        throw new Error(error);
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error(error.message || 'Failed to create category');
      throw error;
    }
  },

  // Update existing category
  update: async (id, categoryData) => {
    try {
      const apperClient = initApperClient();
      const tableName = 'category';
      
      // Only include Updateable fields plus Id
      const params = {
        records: [
          {
            Id: id,
            Name: categoryData.Name,
            Tags: categoryData.Tags,
            Owner: categoryData.Owner
          }
        ]
      };

      const response = await apperClient.updateRecord(tableName, params);
      
      if (response?.success && response.results?.[0]?.success) {
        toast.success('Category updated successfully');
        return response.results[0].data;
      } else {
        const error = response.results?.[0]?.message || 'Failed to update category';
        toast.error(error);
        throw new Error(error);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error(error.message || 'Failed to update category');
      throw error;
    }
  },

  // Delete category
  delete: async (id) => {
    try {
      const apperClient = initApperClient();
      const tableName = 'category';
      
      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord(tableName, params);
      
      if (response?.success && response.results?.[0]?.success) {
        toast.success('Category deleted successfully');
        return true;
      } else {
        const error = response.results?.[0]?.message || 'Failed to delete category';
        toast.error(error);
        throw new Error(error);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Failed to delete category');
      throw error;
    }
  },

  // Search categories
  search: async (query) => {
    try {
      const apperClient = initApperClient();
      const tableName = 'category';
      
      const queryParams = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'],
        where: [
          {
            fieldName: 'Name',
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
      console.error('Error searching categories:', error);
      toast.error('Failed to search categories');
      return [];
    }
  },

  // Get categories by tag
  getByTag: async (tag) => {
    try {
      const apperClient = initApperClient();
      const tableName = 'category';
      
      const queryParams = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'],
        where: [
          {
            fieldName: 'Tags',
            operator: 'Contains',
            values: [tag]
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
      console.error('Error fetching categories by tag:', error);
      toast.error('Failed to load categories');
return [];
    }
  }
};