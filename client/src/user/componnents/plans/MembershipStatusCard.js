export default function MembershipStatusCard({ hasActiveMembership, membership, isLoggedIn }) {
  if (hasActiveMembership) {
    return (
      <div className="mb-8 mx-auto w-full md:w-3/4 rounded-lg border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
          Current membership
        </p>
        <p className="mt-2 text-2xl font-black text-emerald-950">
          {membership.plan.name}
        </p>
        <p className="mt-1 font-semibold text-emerald-800">
          Status: {membership.status || "Active"}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
        {isLoggedIn ? "No active membership" : "Guest mode"}
      </p>
      <p className="mt-2 text-slate-700">
        {isLoggedIn
          ? "Choose a plan and complete payment to activate it."
          : "You can browse plans now. Login is required before purchasing a membership."}
      </p>
    </div>
  );
}
