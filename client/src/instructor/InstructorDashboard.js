import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function InstructorDashboard() {
  const user = useSelector((state) => state.auth.user);
  const name = user?.name || user?.username || "Instructor";

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
          Instructor Interface
        </p>
        <h2 className="mt-2 text-3xl font-bold text-slate-950">
          Welcome, {name}
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Track your classes and member bookings from your instructor workspace.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          to="/instructor/classes"
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-400"
        >
          <h3 className="font-semibold text-slate-950">My Classes</h3>
          <p className="mt-2 text-sm text-slate-600">Open the classes schedule.</p>
        </Link>
       
      </div>
    </section>
  );
}
