import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetClassByIdQuery,
  useUpdateClassMutation,
} from "../../features/classes/classesApi";

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
  "w-full rounded-md border border-slate-300 bg-white p-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500";

export default function UpdateClass() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetClassByIdQuery(id);
  const [updateClass, { isLoading: isUpdating }] = useUpdateClassMutation();
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (!data) return;

    setFormData({
      title: data.title ?? "",
      description: data.description ?? "",
      instructorName: data.instructor?.user?.name ?? "",
      capacity: data.capacity ?? "",
      duration: data.duration ?? "",
      schedule: data.schedule ? data.schedule.slice(0, 16) : "",
      basicPrice: data.memberPrices?.basic ?? data.price ?? "",
      premiumPrice: data.memberPrices?.premium ?? "",
      vipPrice: data.memberPrices?.vip ?? "",
    });
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      id,
      title: formData.title,
      description: formData.description,
      schedule: formData.schedule,
    };

    if (formData.instructorName) payload.instructorName = formData.instructorName;
    if (formData.capacity !== "") payload.capacity = Number(formData.capacity);
    if (formData.duration !== "") payload.duration = Number(formData.duration);
    if (formData.basicPrice !== "") payload.basicPrice = Number(formData.basicPrice);
    if (formData.premiumPrice !== "") payload.premiumPrice = Number(formData.premiumPrice);
    if (formData.vipPrice !== "") payload.vipPrice = Number(formData.vipPrice);

    try {
      await updateClass(payload).unwrap();
      navigate("/admin/classes");
    } catch (err) {
      alert(err?.data?.message || err?.data?.error || "Failed to update class");
    }
  };

  if (isLoading) {
    return <div className="p-6 text-slate-600">Loading class...</div>;
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
          Classes
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Update Class</h1>
        <p className="mt-2 text-slate-600">Edit class details and save changes.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Class title" required className={fieldClass} />
        <input name="description" value={formData.description} onChange={handleChange} placeholder="Description" className={fieldClass} />
        <input name="instructorName" value={formData.instructorName} onChange={handleChange} placeholder="Instructor name" className={fieldClass} />

        <div className="grid gap-4 md:grid-cols-2">
          <input type="number" min="1" name="capacity" value={formData.capacity} onChange={handleChange} placeholder="Capacity" required className={fieldClass} />
          <input type="number" min="1" name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration" required className={fieldClass} />
        </div>

        <input type="datetime-local" name="schedule" value={formData.schedule} onChange={handleChange} required className={fieldClass} />

        <div className="grid gap-4 md:grid-cols-3">
          <input type="number" min="0" name="basicPrice" value={formData.basicPrice} onChange={handleChange} placeholder="Basic price" required className={fieldClass} />
          <input type="number" min="0" name="premiumPrice" value={formData.premiumPrice} onChange={handleChange} placeholder="Premium price" required className={fieldClass} />
          <input type="number" min="0" name="vipPrice" value={formData.vipPrice} onChange={handleChange} placeholder="VIP price" required className={fieldClass} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate("/admin/classes")} className="w-1/2 rounded-md border border-slate-300 py-3 font-bold text-slate-700">
            Cancel
          </button>
          <button type="submit" disabled={isUpdating} className="w-1/2 rounded-md bg-emerald-500 py-3 font-bold text-slate-950 transition hover:bg-emerald-400">
            {isUpdating ? "Updating..." : "Update class"}
          </button>
        </div>
      </form>
    </section>
  );
}
