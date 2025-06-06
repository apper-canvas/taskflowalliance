import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-neu-light dark:shadow-neu-dark">
            <ApperIcon name="Search" className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-surface-900 dark:text-white mb-4">404</h1>
          <h2 className="text-xl font-semibold text-surface-700 dark:text-surface-300 mb-2">Page Not Found</h2>
          <p className="text-surface-600 dark:text-surface-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200 shadow-card"
        >
          <ApperIcon name="ArrowLeft" className="w-5 h-5" />
          <span>Back to Tasks</span>
        </Link>
      </div>
    </div>
  )
}

export default NotFound