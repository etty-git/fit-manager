import { useNavigate } from "react-router-dom";
import { useGetPlansQuery } from "../../features/plans/plansApi";

export default function PlansAdmin() {
  const navigate = useNavigate();
  const { data: plans = [], isLoading, isError } = useGetPlansQuery();

  if (isLoading) return <div className="p-6 text-slate-600">Loading plans...</div>;
  if (isError) return <div className="p-6 text-red-600">Failed to load plans</div>;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
            Membership
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Plans</h1>
          <p className="mt-2 text-slate-600">Shape the pricing and benefits members see.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/admin/plans/addPlan")}
          className="rounded-md bg-emerald-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-400"
        >
          Add plan
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan._id}
            className="flex min-h-[260px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-950">{plan.name}</h2>
                <p className="mt-1 text-sm text-slate-600">{plan.durationDays} days</p>
              </div>
              <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                {plan.isActive === false ? "Inactive" : "Active"}
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              {plan.description || "No description"}
            </p>

            {plan.features?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {plan.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-auto pt-5">
              <p className="text-2xl font-black text-emerald-700">
                NIS {Number(plan.price || 0).toLocaleString("en-US")}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/admin/plans/updatePlan/${plan._id}`)}
                  className="rounded-md bg-slate-950 px-3 py-2 text-sm font-bold text-white"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/admin/plans/deletePlan/${plan._id}`)}
                  className="rounded-md bg-red-500 px-3 py-2 text-sm font-bold text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!plans.length && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
          No active plans found.
        </div>
      )}
    </section>
  );
}
