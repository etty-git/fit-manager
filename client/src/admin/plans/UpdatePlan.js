import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetPlansQuery,
  useUpdatePlanMutation,
} from "../../features/plans/plansApi";

const initialForm = {
  name: "Basic",
  price: "",
  durationDays: "",
  description: "",
  features: "",
  isActive: true,
};

const fieldClass =
  "w-full rounded-md border border-slate-300 bg-white p-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500";

export default function UpdatePlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: plans = [], isLoading } = useGetPlansQuery();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    const plan = plans.find((item) => item._id === id);

    if (plan) {
      setFormData({
        name: plan.name || "Basic",
        price: plan.price ?? "",
        durationDays: plan.durationDays ?? "",
        description: plan.description || "",
        features: Array.isArray(plan.features) ? plan.features.join(", ") : "",
        isActive: plan.isActive !== false,
      });
    }
  }, [id, plans]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updatePlan({
        id,
        name: formData.name,
        price: Number(formData.price),
        durationDays: Number(formData.durationDays),
        description: formData.description,
        isActive: formData.isActive,
        features: formData.features.split(",").map((feature) => feature.trim()).filter(Boolean),
      }).unwrap();

      navigate("/admin/plans");
    } catch (err) {
      alert(err?.data?.message || err?.data?.error || "Failed to update plan");
    }
  };

  if (isLoading) return <div className="p-6 text-slate-600">Loading plan...</div>;

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
          Membership
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Update Plan</h1>
        <p className="mt-2 text-slate-600">Edit membership plan details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <select name="name" value={formData.name} onChange={handleChange} className={fieldClass}>
          <option value="Basic">Basic</option>
          <option value="Premium">Premium</option>
          <option value="VIP">VIP</option>
        </select>
        <input name="price" type="number" min="0" value={formData.price} onChange={handleChange} required className={fieldClass} />
        <input name="durationDays" type="number" min="1" value={formData.durationDays} onChange={handleChange} required className={fieldClass} />
        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className={fieldClass} />
        <input name="features" value={formData.features} onChange={handleChange} placeholder="Features separated by commas" className={fieldClass} />

        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
          Active
        </label>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate("/admin/plans")} className="w-1/2 rounded-md border border-slate-300 py-3 font-bold text-slate-700">
            Cancel
          </button>
          <button type="submit" disabled={isUpdating} className="w-1/2 rounded-md bg-emerald-500 py-3 font-bold text-slate-950 hover:bg-emerald-400">
            {isUpdating ? "Updating..." : "Update plan"}
          </button>
        </div>
      </form>
    </section>
  );
}
