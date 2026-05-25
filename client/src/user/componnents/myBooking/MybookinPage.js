import {
  useGetMyBookingsQuery,
  useCancelBookingMutation
} from "../../../features/booking/bookingApi";
import { useState } from "react";

const formatDateTime = (value) => {
  if (!value) return "Schedule to be announced";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const MyBookingsPage = () => {
  const { data: bookings = [], isLoading, error } = useGetMyBookingsQuery();
  const [cancelBooking] = useCancelBookingMutation();
  const [toast, setToast] = useState("");
  const [loadingIds, setLoadingIds] = useState([]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const handleCancel = async (booking) => {
    const id = booking._id;
    if (loadingIds.includes(id)) return;

    const confirmCancel = window.confirm("Cancel this booking?");
    if (!confirmCancel) return;

    setLoadingIds((prev) => [...prev, id]);

    try {
      await cancelBooking(id).unwrap();
      showToast("Booking cancelled.");
    } catch (err) {
      showToast(err?.data?.error || "Cancel failed.");
    } finally {
      setLoadingIds((prev) => prev.filter((x) => x !== id));
    }
  };

  if (isLoading) return <div className="p-6">Loading bookings...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading bookings</div>;

  return (
    <section className="bg-slate-50 p-6 text-slate-950">
      {toast && (
        <div className="fixed right-5 top-5 rounded-md bg-slate-950 px-4 py-2 text-white">
          {toast}
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-3xl font-black">My Bookings</h1>

        {!bookings.length ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
            You do not have confirmed bookings yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {bookings.map((booking) => {
              const lesson = booking.classId;
              const isCancelling = loadingIds.includes(booking._id);

              return (
                <article
                  key={booking._id}
                  className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${
                    isCancelling ? "opacity-60" : ""
                  }`}
                >
                  <h2 className="text-lg font-bold">{lesson?.title}</h2>
                  <p className="mt-1 text-slate-600">{formatDateTime(lesson?.schedule)}</p>
                  <p className="mt-1 text-slate-600">
                    Instructor: {lesson?.instructor?.user?.name || "Not assigned"}
                  </p>
                  <p className="mt-3 text-sm font-semibold">
                    Status: {booking.status}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Paid: NIS {Number(booking.classPriceSnapshot || 0).toLocaleString("en-US")}
                  </p>

                  {booking.status !== "Cancelled" && (
                    <button
                      onClick={() => handleCancel(booking)}
                      disabled={isCancelling}
                      className={`mt-4 rounded-md px-4 py-2 font-semibold text-white ${
                        isCancelling ? "bg-slate-400" : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {isCancelling ? "Cancelling..." : "Cancel"}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyBookingsPage;
