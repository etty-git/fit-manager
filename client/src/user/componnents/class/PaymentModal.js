import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  useCreatePaymentMutation,
  usePayPaymentMutation,
} from "../../../features/payments/paymentsApi";
import { showNotification } from "../../../features/ui/uiSlice";

const normalizeCardNumber = (value) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const normalizeExpiry = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const normalizeCvv = (value) => value.replace(/\D/g, "").slice(0, 4);

const formatField = (field, value) => {
  if (field === "cardNumber") return normalizeCardNumber(value);
  if (field === "expiry") return normalizeExpiry(value);
  if (field === "cvv") return normalizeCvv(value);
  return value;
};

const validateForm = ({ cardholderName, cardNumber, expiry, cvv }) => {
  if (!cardholderName) return "Cardholder name is required.";
  if (cardNumber.replace(/\s/g, "").length !== 16)
    return "Card number must contain 16 digits.";
  if (!/^\d{2}\/\d{2}$/.test(expiry))
    return "Expiry must use MM/YY format.";
  if (cvv.length < 3) return "CVV must contain at least 3 digits.";
  return null;
};

export default function PaymentModalClass({ lesson, bookingId, onClose }) {
  const dispatch = useDispatch();
  const [createPayment] = useCreatePaymentMutation();
  const [payPayment, { isLoading }] = usePayPaymentMutation();
  const [form, setForm] = useState({
    cardholderName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: formatField(field, value),
    }));
  };

  const handlePay = async () => {
    const error = validateForm(form);

    if (error) {
      dispatch(
        showNotification({
          type: "error",
          title: "Payment error",
          message: error,
        })
      );
      return;
    }

    try {
      const created = await createPayment({
        type: "CLASS",
        classId: lesson._id,
        bookingId,
      }).unwrap();

      await payPayment({ paymentId: created.payment._id }).unwrap();

      dispatch(
        showNotification({
          type: "success",
          title: "Class booked",
          message: "Your payment was completed and your class spot is confirmed.",
        })
      );

      onClose();
    } catch (err) {
      dispatch(
        showNotification({
          type: "error",
          title: "Payment failed",
          message: err?.data?.error || "The payment could not be completed.",
        })
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-950">Complete class payment</h2>

        <p className="mt-4 font-semibold text-slate-900">{lesson.title}</p>
        <p className="mb-4 mt-1 text-slate-600">
          Price: NIS {Number(lesson.price || 0).toLocaleString("en-US")}
        </p>

        <input
          placeholder="Cardholder name"
          className="mb-2 w-full rounded-md border border-slate-300 p-3"
          value={form.cardholderName}
          onChange={(e) => handleChange("cardholderName", e.target.value)}
        />

        <input
          placeholder="Card number"
          className="mb-2 w-full rounded-md border border-slate-300 p-3"
          value={form.cardNumber}
          onChange={(e) => handleChange("cardNumber", e.target.value)}
        />

        <div className="grid gap-2 md:grid-cols-2">
          <input
            placeholder="MM/YY"
            className="mb-2 w-full rounded-md border border-slate-300 p-3"
            value={form.expiry}
            onChange={(e) => handleChange("expiry", e.target.value)}
          />

          <input
            placeholder="CVV"
            type="password"
            className="mb-4 w-full rounded-md border border-slate-300 p-3"
            value={form.cvv}
            onChange={(e) => handleChange("cvv", e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="w-1/2 rounded-md border border-slate-300 p-3 font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={handlePay}
            disabled={isLoading}
            className="w-1/2 rounded-md bg-emerald-600 p-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            {isLoading ? "Processing..." : "Pay now"}
          </button>
        </div>
      </div>
    </div>
  );
}
