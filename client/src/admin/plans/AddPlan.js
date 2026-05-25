import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddPlanMutation } from "../../features/plans/plansApi";

const initialForm = {
  name: "Basic",
  price: "",
  durationDays: "",
  description: "",
  features: "",
};

const fieldClass =
  "w-full rounded-md border border-slate-300 bg-white p-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500";

export default function AddPlan() {
  const navigate = useNavigate();
  const [addPlan, { isLoading }] = useAddPlanMutation();
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addPlan({
        name: formData.name,
        price: Number(formData.price),
        durationDays: Number(formData.durationDays),
        description: formData.description,
        features: formData.features.split(",").map((feature) => feature.trim()).filter(Boolean),
      }).unwrap();
      navigate("/admin/plans");
    } catch (err) {
      alert(err?.data?.message || err?.data?.error || "Failed to add plan");
    }
  };

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">Membership</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Add Plan</h1>
        <p className="mt-2 text-slate-600">Create a membership package.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <select name="name" value={formData.name} onChange={handleChange} className={fieldClass}>
          <option value="Basic">Basic</option>
          <option value="Premium">Premium</option>
          <option value="VIP">VIP</option>
        </select>
        <input name="price" type="number" min="0" value={formData.price} onChange={handleChange} placeholder="Price" required className={fieldClass} />
        <input name="durationDays" type="number" min="1" value={formData.durationDays} onChange={handleChange} placeholder="Duration days" required className={fieldClass} />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" rows="3" className={fieldClass} />
        <input name="features" value={formData.features} onChange={handleChange} placeholder="Features separated by commas" className={fieldClass} />

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate("/admin/plans")} className="w-1/2 rounded-md border border-slate-300 py-3 font-bold text-slate-700">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="w-1/2 rounded-md bg-emerald-500 py-3 font-bold text-slate-950 hover:bg-emerald-400">
            {isLoading ? "Adding..." : "Add plan"}
          </button>
        </div>
      </form>
    </section>
  );
}
