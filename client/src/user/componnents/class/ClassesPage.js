import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useGetMyMembershipQuery } from "../../../features/plans/plansApi";
import { useGetClassesQuery } from "../../../features/classes/classesApi";
import { useCreateBookingMutation } from "../../../features/booking/bookingApi";
import { loadStoredJson, storageKeys } from "../../../utils/storage";
import RegisterButton from "./RegisterButton";
import PaymentModal from "./PaymentModal";

const formatCurrency = (value) =>
  `NIS ${Number(value || 0).toLocaleString("en-US")}`;

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

const getPlanPriceKey = (planName) => {
  const normalized = String(planName || "Basic").toLowerCase();
  if (normalized === "vip") return "vip";
  if (normalized === "premium") return "premium";
  return "basic";
};

const getLessonPrice = (lesson, membership) => {
  const prices = lesson.memberPrices || {};
  if (membership?.status !== "Active") {
    return prices.basic ?? lesson.price ?? 0;
  }

  const key = getPlanPriceKey(membership?.plan?.name);
  return prices[key] ?? prices.basic ?? lesson.price ?? 0;
};

export default function ClassesPage() {
  const authUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = Boolean(token && authUser);
  const storedMembership = loadStoredJson(storageKeys.membership, null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { data: classes = [], isLoading } = useGetClassesQuery();
  const { data: membership } = useGetMyMembershipQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [createBooking] = useCreateBookingMutation();
  const effectiveMembership =
    membership || (isAuthenticated ? storedMembership : null);

  const sortedClasses = useMemo(
    () => [...classes].sort((a, b) => new Date(a.schedule) - new Date(b.schedule)),
    [classes]
  );

  const handleRegister = async (lesson) => {
    try {
      const res = await createBooking({ classId: lesson._id }).unwrap();
      const price = getLessonPrice(lesson, effectiveMembership);

      setSelectedLesson({ ...lesson, price });
      setSelectedBooking(res.booking);
    } catch (err) {
      alert(err?.data?.error || "Booking failed");
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center">Loading classes...</div>;
  }

  return (
    <section className="bg-slate-50 px-4 py-8 text-slate-950">
      <div className="mx-auto mb-8 max-w-6xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-600">
          Classes
        </p>
        <h1 className="mt-2 text-3xl font-black">Book your next workout</h1>
        <p className="mt-2 text-slate-600">
          Your spot is confirmed only after payment is completed.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        {sortedClasses.map((lesson) => {
          const effectivePrice = getLessonPrice(lesson, effectiveMembership);

          return (
            <article
              key={lesson._id}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold">{lesson.title}</h2>
              <p className="mt-2 text-slate-600">
                Instructor: {lesson?.instructor?.user?.name || "Not assigned"}
              </p>
              <p className="mt-2 text-slate-600">{formatDateTime(lesson.schedule)}</p>
              <p className="mt-4 text-2xl font-black text-emerald-700">
                {formatCurrency(effectivePrice)}
              </p>
              <RegisterButton lesson={lesson} onRegister={handleRegister} />
            </article>
          );
        })}
      </div>

      {selectedLesson && selectedBooking && (
        <PaymentModal
          lesson={selectedLesson}
          bookingId={selectedBooking._id}
          onClose={() => {
            setSelectedLesson(null);
            setSelectedBooking(null);
          }}
        />
      )}
    </section>
  );
}
