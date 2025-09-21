import { Navigate, useLocation } from "react-router-dom";
import { getAuthToken } from "../utils/page";
import { useMeQuery } from "../services/apis/AuthApi";

const ProtectedRoute = ({ children }) => {
  const token = getAuthToken();
  const location = useLocation();

  // Check if token exists - redirect silently if no token
  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Get user data from /me
  const { data: user, isLoading, error } = useMeQuery();

  // While loading user data, don't render children or redirect
  if (isLoading) return null;

  // If there's an error (invalid/expired token) or user is suspended, redirect silently
  if (error || user?.status === "suspended") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // If everything is fine, render the protected component
  return children;
};

export default ProtectedRoute;