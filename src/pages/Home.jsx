import { useState, useEffect } from 'react'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode)
    document.documentElement.classList.toggle('dark', newDarkMode)
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-surface-800 shadow-soft border-b border-surface-200 dark:border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center shadow-card">
                <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-surface-900 dark:text-white">TaskFlow</h1>
                <p className="text-sm text-surface-600 dark:text-surface-400">Organize your daily tasks</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors duration-200"
              >
                <ApperIcon 
                  name={darkMode ? "Sun" : "Moon"} 
                  className="w-5 h-5 text-surface-600 dark:text-surface-400" 
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <MainFeature />
      </main>
    </div>
  )
}

export default Home