import { useGetInstructorsQuery } from "../../features/instructors/instructorsApi";
import { useNavigate } from "react-router-dom";

export default function AdminInstructors() {
  const { data: instructors = [], isLoading, isError } = useGetInstructorsQuery();
  const navigate = useNavigate();

  if (isLoading) return <div className="p-6 text-slate-600">Loading instructors...</div>;
  if (isError) return <div className="p-6 text-red-600">Failed to load instructors</div>;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
            Coaching Team
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Instructors</h1>
          <p className="mt-2 text-slate-600">Manage coaches, specialties, and class ownership.</p>
        </div>
        <button
          className="rounded-md bg-emerald-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-400"
          onClick={() => navigate("/admin/instructors/AddInstructor")}
        >
          Add instructor
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {instructors.map((instructor) => (
          <article
            key={instructor._id}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-xl font-bold text-slate-950">
              {instructor.user?.name || "Instructor"}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {instructor.user?.email || "No email"}
            </p>
            <div className="mt-4 grid gap-2 text-sm text-slate-700">
              <p>Specialty: {instructor.specialty}</p>
              <p>Experience: {instructor.experienceYears || 0} years</p>
              <p>Rating: {instructor.rating || 0}/5</p>
            </div>
            <button
              onClick={() => navigate(`/admin/instructors/deleteInstructor/${instructor._id}`)}
              className="mt-5 rounded-md bg-red-500 px-4 py-2 text-sm font-bold text-white"
            >
              Delete
            </button>
          </article>
        ))}
      </div>

      {!instructors.length && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
          No instructors found.
        </div>
      )}
    </section>
  );
}
