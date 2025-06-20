import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // If no token, redirect to login with return URL
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (payload.exp && payload.exp < currentTime) {
      localStorage.removeItem("token");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user has required role
    if (!allowedRoles.includes(payload.role)) {
      // Redirect based on actual role
      if (payload.role === "admin") {
        return <Navigate to="/admin" replace />;
      } else if (payload.role === "owner") {
        return <Navigate to="/owner" replace />;
      } else {
        return <Navigate to="/login" replace />;
      }
    }

    return children;
  } catch (err) {
    // Invalid token
    localStorage.removeItem("token");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
}

export default PrivateRoute;
