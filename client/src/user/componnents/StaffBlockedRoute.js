import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getHomePathForRole } from "../../utils/roleRedirect";

const staffRoles = ["admin", "instructor"];

export default function StaffBlockedRoute({ children }) {
  const user = useSelector((state) => state.auth.user);

  if (staffRoles.includes(user?.role)) {
    return <Navigate to={getHomePathForRole(user.role)} replace />;
  }

  return children;
}
