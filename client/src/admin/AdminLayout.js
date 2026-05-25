import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import NotificationCenter from "../common/NotificationCenter";
import BrandLogo from "../common/BrandLogo";

const adminLinks = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/classes", label: "Classes" },
  { to: "/admin/plans", label: "Plans" },
  { to: "/admin/payments", label: "Payments" },
  { to: "/admin/instructors", label: "Instructors" },
  { to: "/admin/contact", label: "Messages" },
];

const linkClass = "rounded-md px-4 py-3 text-sm font-bold transition";

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const displayName = user?.name || user?.username || user?.email || "Admin";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <NotificationCenter />
      <header className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <BrandLogo />
            <p className="mt-2 text-sm text-slate-600">Admin workspace for {displayName}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {adminLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `${linkClass} ${
                    isActive
                      ? "bg-slate-950 text-white"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className={`${linkClass} border border-slate-200 bg-white text-slate-700 hover:border-slate-400`}
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
