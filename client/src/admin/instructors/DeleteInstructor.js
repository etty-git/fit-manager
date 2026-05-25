import { useNavigate, useParams } from "react-router-dom";
import { useDeleteInstructorMutation } from "../../features/instructors/instructorsApi";

const DeleteInstructor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteInstructor, { isLoading }] = useDeleteInstructorMutation();

  const handleDelete = async () => {
    try {
      await deleteInstructor(id).unwrap();
      navigate("/admin/instructors");
    } catch (err) {
      alert(err?.data?.message || err?.data?.error || "Failed to delete instructor");
    }
  };

  return (
    <section className="mx-auto mt-20 max-w-md space-y-4 rounded-lg border border-slate-800 bg-slate-900 p-6 text-center">
      <h1 className="text-2xl font-bold text-white">Delete Instructor</h1>
      <p className="text-slate-400">
        Are you sure you want to delete this instructor? Existing pending or booked
        bookings will be cancelled.
      </p>

      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/admin/instructors")}
          className="rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white hover:bg-slate-600"
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

export default DeleteInstructor;