import { useMemo } from "react";
import { useGetPaymentsQuery } from "../../features/payments/paymentsApi";

const formatDate = (value) => {
  if (!value) return "Not paid";

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

export default function AdminPayments() {
  const { data: payments = [], isLoading, isError } = useGetPaymentsQuery();
  const paidTotal = useMemo(
    () =>
      payments
        .filter((payment) => payment.status === "Paid")
        .reduce((sum, payment) => sum + (payment.amount || 0), 0),
    [payments]
  );

  if (isLoading) return <div className="p-6 text-slate-600">Loading payments...</div>;
  if (isError) return <div className="p-6 text-red-600">Failed to load payments</div>;

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
          Payments
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Payment Activity</h1>
        <p className="mt-2 text-slate-600">
          Paid revenue: <span className="font-bold text-slate-950">NIS {Number(paidTotal || 0).toLocaleString("en-US")}</span>
        </p>
      </div>

      <div className="grid gap-4">
        {payments.map((payment) => (
          <article
            key={payment._id}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  {payment.type} payment
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  User: {payment.user?.name || payment.user?.email || "Unknown"}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Paid at: {formatDate(payment.paidAt)}
                </p>
              </div>
              <div className="flex flex-col gap-2 text-sm md:items-end">
                <span className="rounded-md bg-emerald-50 px-4 py-2 font-bold text-emerald-800">
                  NIS {Number(payment.amount || 0).toLocaleString("en-US")}
                </span>
                <span className="font-semibold text-slate-600">{payment.status}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!payments.length && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
          No payments found.
        </div>
      )}
    </section>
  );
}
