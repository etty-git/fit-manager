import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetAdminStatsQuery } from "../features/admin/adminApi";

const formatCurrency = (value) =>
  `NIS ${Number(value || 0).toLocaleString("en-US")}`;

const StatCard = ({ label, value }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
      {label}
    </p>
    <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
  </div>
);

const BarChart = ({ title, data = [], valueFormatter = (value) => value }) => {
  const max = Math.max(...data.map((item) => item.value || 0), 1);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      <div className="mt-5 space-y-4">
        {data.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-semibold text-slate-700">{item.label}</span>
              <span className="text-slate-500">{valueFormatter(item.value)}</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100">
              <div
                className="h-3 rounded-full bg-emerald-500"
                style={{ width: `${Math.max(6, (item.value / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
        {!data.length && <p className="text-sm text-slate-500">No data yet.</p>}
      </div>
    </section>
  );
};

export default function AdminDashboard() {
  const user = useSelector((state) => state.auth.user);
  const name = user?.name || user?.username || "Admin";
  const { data: stats, isLoading } = useGetAdminStatsQuery();

  const totals = stats?.totals || {};

  return (
    <section className="space-y-6 text-slate-950">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
          FitManager Analytics
        </p>
        <h2 className="mt-2 text-3xl font-bold">Welcome, {name}</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Track revenue, classes, instructor performance, and member activity from one clean workspace.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Revenue" value={formatCurrency(totals.revenue)} />
        <StatCard label="Active members" value={totals.activeMembers || 0} />
        <StatCard label="Booked classes" value={totals.bookings || 0} />
        <StatCard label="Instructors" value={totals.instructors || 0} />
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
          Loading analytics...
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <BarChart
            title="Revenue by Month"
            data={stats?.revenueByMonth || []}
            valueFormatter={formatCurrency}
          />
          <BarChart
            title="Payments by Type"
            data={stats?.revenueByType || []}
            valueFormatter={formatCurrency}
          />
          <BarChart
            title="Instructor Monthly Income"
            data={stats?.instructorRevenue || []}
            valueFormatter={formatCurrency}
          />
          <BarChart
            title="Most Popular Classes"
            data={stats?.popularClasses || []}
            valueFormatter={(value) => `${value} bookings`}
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-5">
        {[
          ["/admin/classes", "Classes"],
          ["/admin/plans", "Plans"],
          ["/admin/payments", "Payments"],
          ["/admin/instructors", "Instructors"],
          ["/admin/contact", "Messages"],
        ].map(([to, label]) => (
          <Link
            key={to}
            to={to}
            className="rounded-lg border border-slate-200 bg-white p-4 text-center font-semibold shadow-sm transition hover:border-emerald-400"
          >
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}
