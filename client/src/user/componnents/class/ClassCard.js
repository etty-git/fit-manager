import React from "react";
import RegisterButton from "./RegisterButton";

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

export default function ClassCard({ lesson, membership, onRegister }) {
  const price = getLessonPrice(lesson, membership);
  const spotsLeft = Math.max(
    (lesson.capacity || 0) - (lesson.currentCapacity || 0),
    0
  );

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">{lesson.title}</h2>
      <p className="mt-2 text-slate-600">{lesson.description}</p>
      <div className="mt-4 space-y-1 text-sm text-slate-600">
        <p>{formatDateTime(lesson.schedule)}</p>
        <p>Open spots: {spotsLeft}</p>
        <p>Instructor: {lesson?.instructor?.user?.name || "Not assigned"}</p>
      </div>
      <p className="mt-4 text-lg font-bold text-emerald-700">
        {formatCurrency(price)}
      </p>
      <RegisterButton lesson={lesson} onRegister={onRegister} />
    </article>
  );
}
