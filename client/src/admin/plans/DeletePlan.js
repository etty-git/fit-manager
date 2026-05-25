import { useNavigate, useParams } from "react-router-dom";
import { useDeletePlanMutation } from "../../features/plans/plansApi";

export default function DeletePlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deletePlan, { isLoading }] = useDeletePlanMutation();

  const handleDelete = async () => {
    try {
      await deletePlan(id).unwrap();
      navigate("/admin/plans");
    } catch (err) {
      alert(err?.data?.message || err?.data?.error || "Failed to delete plan");
    }
  };

  return (
    <section className="mx-auto mt-20 max-w-md space-y-4 rounded-lg border border-slate-800 bg-slate-900 p-6 text-center">
      <h1 className="text-2xl font-bold text-white">Delete Plan</h1>
      <p className="text-slate-400">
        Are you sure you want to delete this plan?
      </p>

      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/admin/plans")}
          className="rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isLoading}
          className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
        >
          {isLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </section>
  );
}
