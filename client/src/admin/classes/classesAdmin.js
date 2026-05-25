import { useMemo } from "react";
import { useGetClassesQuery } from "../../features/classes/classesApi";
import { useNavigate } from "react-router-dom";

const formatDateTime = (value) => {
  if (!value) return "Schedule not set";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const formatPrices = (lesson) => {
  const prices = lesson.memberPrices || {};
  const basic = prices.basic ?? lesson.price ?? 0;
  const premium = prices.premium ?? basic;
  const vip = prices.vip ?? premium;

  return [
    ["Basic", basic],
    ["Premium", premium],
    ["VIP", vip],
  ];
};

export default function ClassesAdmin() {
  const { data: classes = [], isLoading, isError } = useGetClassesQuery();
  const navigate = useNavigate();
  const sortedClasses = useMemo(
    () => [...classes].sort((a, b) => new Date(a.schedule) - new Date(b.schedule)),
    [classes]
  );

  if (isLoading) return <div className="p-6 text-slate-600">Loading classes...</div>;
  if (isError) return <div className="p-6 text-red-600">Failed to load classes</div>;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
            Classes
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Class Management</h1>
          <p className="mt-2 text-slate-600">Create schedules, assign instructors, and track capacity.</p>
        </div>
        <button
          className="rounded-md bg-emerald-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-400"
          onClick={() => navigate("/admin/classes/addClass")}
        >
          Add class
        </button>
      </div>

      <div className="grid gap-4">
        {sortedClasses.map((lesson) => (
          <article
            key={lesson._id}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-950">{lesson.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{formatDateTime(lesson.schedule)}</p>
                <p className="mt-1 text-sm text-slate-600">
                  Instructor: {lesson?.instructor?.user?.name || "Not assigned"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {formatPrices(lesson).map(([label, value]) => (
                  <span key={label} className="rounded-md bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700">
                    {label}: NIS {Number(value || 0).toLocaleString("en-US")}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/admin/classes/updateClass/${lesson._id}`)}
                  className="rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white"
                >
                  Update
                </button>
                <button
                  onClick={() => navigate(`/admin/classes/deleteClass/${lesson._id}`)}
                  className="rounded-md bg-red-500 px-4 py-2 text-sm font-bold text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
