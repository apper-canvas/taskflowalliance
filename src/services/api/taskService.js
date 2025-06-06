import tasksData from '../mockData/tasks.json'

class TaskService {
  constructor() {
    this.tasks = [...tasksData]
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.tasks]
  }

  async getById(id) {
    await this.delay()
    const task = this.tasks.find(task => task.id === id)
    if (!task) {
      throw new Error('Task not found')
    }
    return { ...task }
  }

  async create(taskData) {
    await this.delay()
    const newTask = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completedAt: null,
      ...taskData
    }
    this.tasks.unshift(newTask)
    return { ...newTask }
  }

  async update(id, updateData) {
    await this.delay()
    const index = this.tasks.findIndex(task => task.id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    this.tasks[index] = { ...this.tasks[index], ...updateData }
    return { ...this.tasks[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.tasks.findIndex(task => task.id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    this.tasks.splice(index, 1)
    return true
  }
}

export default new TaskService()