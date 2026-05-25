const planAccentMap = {
  Basic: "border-blue-400 bg-blue-400/15",
  Premium: "border-blue-500 bg-blue-500/20",
  VIP: "border-blue-600 bg-blue-500/25",
};
export default function PlanCard({
  plan,
  isActivePlan,
  selectionLocked,
  isLoggedIn,
  isBusy,
  onSelect,
}) {
  const accentClasses = planAccentMap[plan.name] || "border-slate-200 bg-white";
  const isViewOnly = !isLoggedIn;

  return (
    <article className={`flex min-h-[320px] flex-col rounded-lg border p-6 shadow-sm ${accentClasses}`}>
      <div className="mb-5">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-slate-500">
          {plan.name}
        </p>
        <h2 className="mb-2 text-4xl font-black text-slate-950">
          NIS {Number(plan.price || 0).toLocaleString("en-US")}
        </h2>
        <p className="font-semibold text-slate-700">{plan.durationDays} days</p>
      </div>

      {plan.description ? (
        <p className="mb-4 text-slate-700">{plan.description}</p>
      ) : null}

      <div className="mb-6 min-h-[120px]">
        {plan.features?.length ? (
          <ul className="space-y-2 text-slate-800">
            {plan.features.map((feature, index) => (
              <li key={`${plan._id}-${index}`} className="rounded-md bg-white/75 px-3 py-2 text-sm font-medium">
                {feature}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-600">No features listed yet.</p>
        )}
      </div>

      {isViewOnly ? (
        <div className="mt-auto w-full rounded-md border border-slate-200 bg-white/70 px-4 py-3 text-center text-sm font-bold text-slate-600">
          Login to purchase
        </div>
      ) : (
        <button
          type="button"
          disabled={isBusy || isActivePlan || selectionLocked}
          onClick={() => onSelect(plan)}
          className={`mt-auto w-full rounded-md px-4 py-3 font-bold transition ${
            isActivePlan
              ? "cursor-default bg-emerald-600 text-white"
              : selectionLocked
                ? "cursor-not-allowed bg-slate-300 text-slate-600"
                : "bg-slate-950 text-white hover:bg-slate-800"
          } disabled:opacity-70`}
        >
          {isActivePlan
            ? "Current plan"
            : selectionLocked
              ? "Plan change unavailable"
              : "Choose this plan"}
        </button>
      )}
    </article>
  );
}
