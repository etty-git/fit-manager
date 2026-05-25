import { useState } from "react";
import { useAddClassMutation } from "../../features/classes/classesApi";
import { Link, useNavigate } from "react-router-dom";

const initialForm = {
  title: "",
  description: "",
  instructorName: "",
  capacity: "",
  duration: "",
  schedule: "",
  basicPrice: "",
  premiumPrice: "",
  vipPrice: "",
};

const fieldClass =
  "rounded-md border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500";

export default function AddClass() {
  const navigate = useNavigate();
  const [addClass, { isLoading }] = useAddClassMutation();
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addClass({
        ...formData,
        capacity: Number(formData.capacity),
        duration: Number(formData.duration),
        basicPrice: Number(formData.basicPrice),
        premiumPrice: Number(formData.premiumPrice),
        vipPrice: Number(formData.vipPrice),
      }).unwrap();

      navigate("/admin/classes");
    } catch (err) {
      alert(err?.data?.message || "Failed to add class");
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
          Classes
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">Add Class</h2>
        <p className="mt-2 text-slate-600">Create a class with instructor and plan-based pricing.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <Link to="/admin/classes" className="text-sm font-bold text-emerald-700 hover:underline">
            Back to Classes
          </Link>
          <input name="title" placeholder="Class title" onChange={handleChange} required className={fieldClass} />
          <input name="description" placeholder="Description" onChange={handleChange} className={fieldClass} />
          <input name="instructorName" placeholder="Instructor name" onChange={handleChange} required className={fieldClass} />
          <input type="number" name="capacity" placeholder="Capacity" onChange={handleChange} required className={fieldClass} />
          <input type="number" name="duration" placeholder="Duration (minutes)" onChange={handleChange} required className={fieldClass} />
          <input type="datetime-local" name="schedule" onChange={handleChange} required className={fieldClass} />
          <input type="number" min="0" name="basicPrice" placeholder="Basic plan price" onChange={handleChange} required className={fieldClass} />
          <input type="number" min="0" name="premiumPrice" placeholder="Premium plan price" onChange={handleChange} required className={fieldClass} />
          <input type="number" min="0" name="vipPrice" placeholder="VIP plan price" onChange={handleChange} required className={fieldClass} />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-5 w-full rounded-md bg-emerald-500 py-3 font-bold text-slate-950 transition hover:bg-emerald-400"
        >
          {isLoading ? "Adding..." : "Add class"}
        </button>
      </form>
    </section>
  );
}
