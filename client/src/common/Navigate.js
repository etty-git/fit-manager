import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/plans", label: "Plans" },
  { to: "/classes", label: "Classes" },
  { to: "/mybookings", label: "Bookings", protected: true },
  { to: "/contact", label: "Messages", protected: true },
  { to: "/admin", label: "Admin", protected: true, roles: ["admin"] },
  { to: "/instructor", label: "Instructor", protected: true, roles: ["instructor"] },
];

const baseLinkClass =
  "rounded-md px-3 py-2 text-sm font-bold transition";

const Navigate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="flex flex-wrap items-center justify-end gap-2">
      {navItems
        .filter((item) => !item.protected || token)
        .filter((item) => !item.roles || item.roles.includes(user?.role))
        .map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `${baseLinkClass} ${
                isActive
                  ? "bg-slate-950 text-white"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}

      {token ? (
        <button
          onClick={handleLogout}
          className={`${baseLinkClass} border border-slate-200 bg-white text-slate-700 hover:border-slate-400`}
        >
          Logout
        </button>
      ) : (
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `${baseLinkClass} ${
              isActive
                ? "bg-slate-950 text-white"
                : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
            }`
          }
        >
          Login
        </NavLink>
      )}
    </nav>
  );
};

export default Navigate;
