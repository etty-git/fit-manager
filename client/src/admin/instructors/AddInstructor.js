import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddInstructorMutation } from "../../features/instructors/instructorsApi";

const initialForm = {
  specialty: "",
  bio: "",
  experienceYears: "",
  name: "",
  username: "",
  email: "",
  phone: "",
  password: "",
  rating: "",
};

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white p-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500";

const AddInstructor = () => {
  const navigate = useNavigate();
  const [instructorData, setInstructorData] = useState(initialForm);
  const [addInstructor, { isLoading }] = useAddInstructorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInstructorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addInstructor(instructorData).unwrap();
      setInstructorData(initialForm);
      navigate("/admin/instructors");
    } catch (error) {
      alert(error?.data?.message || error?.data?.error || "Failed to add instructor");
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
          Coaching Team
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Add Instructor</h1>
        <p className="mt-2 text-slate-600">Create a coach profile and login account.</p>
      </div>

      <form className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <input name="name" placeholder="Name" value={instructorData.name} onChange={handleChange} className={inputClass} required />
          <input name="username" placeholder="Username" value={instructorData.username} onChange={handleChange} className={inputClass} required />
          <input name="email" placeholder="Email" type="email" value={instructorData.email} onChange={handleChange} className={inputClass} required />
          <input name="phone" placeholder="Phone" value={instructorData.phone} onChange={handleChange} className={inputClass} required />
          <input type="password" name="password" placeholder="Password" value={instructorData.password} onChange={handleChange} className={inputClass} required />
          <input name="specialty" placeholder="Specialty" value={instructorData.specialty} onChange={handleChange} className={inputClass} required />
          <input name="bio" placeholder="Bio" value={instructorData.bio} onChange={handleChange} className={inputClass} />
          <input type="number" name="experienceYears" placeholder="Experience Years" value={instructorData.experienceYears} onChange={handleChange} className={inputClass} />
          <input type="number" name="rating" step="0.1" min="0" max="5" placeholder="Rating" value={instructorData.rating} onChange={handleChange} className={inputClass} />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-5 w-full rounded-md bg-emerald-500 p-3 font-bold text-slate-950 transition hover:bg-emerald-400"
        >
          {isLoading ? "Adding..." : "Add instructor"}
        </button>
      </form>
    </section>
  );
};

export default AddInstructor;
