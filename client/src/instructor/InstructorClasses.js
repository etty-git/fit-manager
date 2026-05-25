import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetClassesQuery } from "../features/classes/classesApi";

const formatDateTime = (value) => {
  if (!value) return "Schedule not set";

  return new Intl.DateTimeFormat("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const formatPrice = (value) =>
  `NIS ${Number(value || 0).toLocaleString("en-US")}`;

export default function InstructorClasses() {
  const user = useSelector((state) => state.auth.user);
  const { data: classes = [], isLoading, isError } = useGetClassesQuery();

  const instructorClasses = useMemo(() => {
    const userId = user?.id || user?._id;

    return classes.filter((lesson) => {
      const instructorUserId = lesson?.instructor?.user?._id || lesson?.instructor?.user;
      return !userId || instructorUserId === userId;
    });
  }, [classes, user]);

  if (isLoading) return <div className="p-6 text-slate-600">Loading classes...</div>;
  if (isError) return <div className="p-6 text-red-600">Failed to load classes</div>;

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
          Instructor Classes
        </p>
        <h1 className="mt-2 text-3xl font-bold">My Class Schedule</h1>
      </div>

      <div className="grid gap-4">
        {instructorClasses.map((lesson) => (
          <article
            key={lesson._id}
            className="rounded-lg border border-emerald-100 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold">{lesson.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{formatDateTime(lesson.schedule)}</p>
            <p className="mt-2 text-sm font-semibold text-emerald-700">
              Basic: {formatPrice(lesson.memberPrices?.basic ?? lesson.price)}
            </p>
            <p className="text-sm font-semibold text-emerald-700">
              Premium: {formatPrice(lesson.memberPrices?.premium ?? lesson.price)}
            </p>
            <p className="text-sm font-semibold text-emerald-700">
              VIP: {formatPrice(lesson.memberPrices?.vip ?? lesson.price)}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Enrolled: {lesson.currentCapacity || 0} / {lesson.capacity || "N/A"}
            </p>
          </article>
        ))}
      </div>

      {!instructorClasses.length && (
        <div className="rounded-lg border border-emerald-100 bg-white p-6 text-slate-600">
          No classes are assigned to you yet.
        </div>
      )}
    </section>
  );
}
