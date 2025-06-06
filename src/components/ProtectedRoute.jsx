import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user?.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    // Redirect to login with the current location as redirect parameter
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />
  }

  return children
}

export default ProtectedRoute