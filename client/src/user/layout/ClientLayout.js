import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navigate from "../../common/Navigate";
import NotificationCenter from "../../common/NotificationCenter";
import BrandLogo from "../../common/BrandLogo";
import Chatbot from "../pages/Chatbot";
export const ClientLayout = () => {
  const user = useSelector((state) => state.auth.user);
  const displayName = user?.name || user?.username || user?.email || null;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <NotificationCenter />
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 md:flex-row">
          <BrandLogo />
          <div className="flex flex-col items-center gap-3 md:items-end">
            {displayName && (
              <p className="text-sm font-medium text-slate-700">
                Hello, <span className="text-slate-950">{displayName}</span>
              </p>
            )}
            <Navigate />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      {user && <Chatbot />}
      <footer className="border-t border-slate-200 bg-white px-4 py-5 text-center text-sm font-medium text-slate-600">
        2026 FitManager Athletic Club
      </footer>
    </div>
  );
};

export default ClientLayout;
