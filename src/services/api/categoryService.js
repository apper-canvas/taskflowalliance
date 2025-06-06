import categoriesData from '../mockData/categories.json'

class CategoryService {
  constructor() {
    this.categories = [...categoriesData]
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.categories]
  }

  async getById(id) {
    await this.delay()
    const category = this.categories.find(category => category.id === id)
    if (!category) {
      throw new Error('Category not found')
    }
    return { ...category }
  }

  async create(categoryData) {
    await this.delay()
    const newCategory = {
      id: Date.now().toString(),
      taskCount: 0,
      ...categoryData
    }
    this.categories.unshift(newCategory)
    return { ...newCategory }
  }

  async update(id, updateData) {
    await this.delay()
    const index = this.categories.findIndex(category => category.id === id)
    if (index === -1) {
      throw new Error('Category not found')
    }
    
    this.categories[index] = { ...this.categories[index], ...updateData }
    return { ...this.categories[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.categories.findIndex(category => category.id === id)
    if (index === -1) {
      throw new Error('Category not found')
    }
    
    this.categories.splice(index, 1)
    return true
  }
}

export default new CategoryService()