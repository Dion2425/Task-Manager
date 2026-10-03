import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTokenRoles } from "../utils/jwt";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { token, isAuthenticated } = useAuth();

  if (!isAuthenticated || !token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0) {
    const roles = getTokenRoles(token);
    const isAllowed = roles.some((role) => allowedRoles.includes(role));

    if (!isAllowed) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;