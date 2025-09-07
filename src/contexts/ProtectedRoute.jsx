import { Navigate, useLocation } from "react-router-dom";
import { getAuthToken } from "../utils/page";
import { useMeQuery } from "../services/apis/AuthApi";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const token = getAuthToken();
  const location = useLocation();

  // Check if token exists
  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Get user data from /me
  const { data: user, isLoading } = useMeQuery();

  // While loading user data, don't render children or redirect
  if (isLoading) return null;

  // If user is suspended, redirect to login and show toast
  if (user?.status === "suspended") {
    toast.error(
      user?.locale === "ar"
        ? "تم تعليق حسابك، يرجى التواصل مع الإدارة."
        : "Your account is suspended, please contact the admin."
    );
    //  refresh after 3 seconds
    setTimeout(() => {
      window.location.reload();
    }, 3000);
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // If everything is fine, render the protected component
  return children;
};

export default ProtectedRoute;