import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getHomePathForRole } from "../../utils/roleRedirect";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getHomePathForRole(user?.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
