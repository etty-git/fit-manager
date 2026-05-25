import React, { useState } from "react";

const formatDateTime = (value) => {
  if (!value) return "לא נקבע מועד";

  return new Intl.DateTimeFormat("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

export default function MyClassCard({ lesson, onCancel }) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (loading) return;

    const confirmCancel = window.confirm("לבטל את ההרשמה לשיעור?");
    if (!confirmCancel) return;

    setLoading(true);

    try {
      await onCancel(lesson._id);
    } finally {
      setLoading(false);
    }
  };

  const isCancelled = lesson.status === "Cancelled";

  // 🔥 חשוב: הנתונים מגיעים מ-classId
  const classData = lesson.classId;

  return (
    <article className="rounded-2xl border bg-white p-6 shadow-sm">

      {/* כותרת */}
      <h2 className="text-xl font-bold mb-2">
        {classData?.title || "שיעור"}
      </h2>

      {/* תיאור */}
      <p className="text-gray-600 mb-3">
        {classData?.description || ""}
      </p>

      {/* מידע */}
      <div className="text-sm space-y-1">
        <p>📅 {formatDateTime(classData?.schedule)}</p>

        <p>
          👤 מדריך:{" "}
          {classData?.instructor?.user?.name || "לא מוגדר"}
        </p>

        <p>
          📌 סטטוס:{" "}
          <span className={isCancelled ? "text-red-500" : "text-green-600"}>
            {lesson.status || "Booked"}
          </span>
        </p>
      </div>

      {/* כפתור */}
      {!isCancelled && (
        <button
          onClick={handleCancel}
          disabled={loading}
          className={`mt-4 px-4 py-2 rounded-lg text-white ${
            loading ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {loading ? "Cancelling..." : "Cancel Booking"}
        </button>
      )}
    </article>
  );
}