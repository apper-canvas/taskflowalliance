class TaskService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'task'
    
    // All fields for fetch operations (including System fields for display)
    this.allFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'title', 'description', 'priority', 'category', 'due_date', 'status', 'is_archived', 'completed_at', 'created_at'
    ]
    
    // Only Updateable fields for create/update operations
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'title', 'description', 'priority', 'category', 
      'due_date', 'status', 'is_archived', 'completed_at', 'created_at'
    ]
  }

  async getAll() {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [
          {
            fieldName: "created_at",
            SortType: "DESC"
          }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      return response?.data || []
    } catch (error) {
      console.error("Error fetching tasks:", error)
      throw error
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: this.allFields
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      return response?.data || null
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error)
      throw error
    }
  }

  async create(taskData) {
    try {
      // Filter data to only include updateable fields
      const filteredData = {}
      this.updateableFields.forEach(field => {
        if (taskData.hasOwnProperty(field)) {
          filteredData[field] = taskData[field]
        }
      })

      const params = {
        records: [filteredData]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (response?.success && response?.results?.[0]?.success) {
        return response.results[0].data
      } else {
        throw new Error(response?.results?.[0]?.message || 'Failed to create task')
      }
    } catch (error) {
      console.error("Error creating task:", error)
      throw error
    }
  }

  async update(id, updateData) {
    try {
      // Filter data to only include updateable fields plus ID
      const filteredData = { Id: id }
      this.updateableFields.forEach(field => {
        if (updateData.hasOwnProperty(field)) {
          filteredData[field] = updateData[field]
        }
      })

      const params = {
        records: [filteredData]
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (response?.success && response?.results?.[0]?.success) {
        return response.results[0].data
      } else {
        throw new Error(response?.results?.[0]?.message || 'Failed to update task')
      }
    } catch (error) {
      console.error("Error updating task:", error)
      throw error
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      }
      
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (response?.success) {
        return true
      } else {
        throw new Error('Failed to delete task')
      }
    } catch (error) {
      console.error("Error deleting task:", error)
      throw error
    }
  }
}

export default new TaskService()