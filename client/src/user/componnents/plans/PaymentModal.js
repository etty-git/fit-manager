// פונקציה שמנקה ומעצבת מספר כרטיס אשראי:
// - מסירה תווים שאינם ספרות
// - מגבילה ל־16 ספרות
// - מוסיפה רווח כל 4 ספרות (קריא יותר)
const normalizeCardNumber = (value) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

// פונקציה שמעצבת תאריך תפוגה של כרטיס:
// - מסירה תווים לא מספריים
// - מגבילה ל־4 ספרות (MMYY)
// - מוסיפה "/" אחרי חודש
const normalizeExpiry = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length < 3) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

// פונקציה שמנקה CVV:
// - משאירה רק ספרות
// - מגבילה ל־3-4 ספרות
const normalizeCvv = (value) => value.replace(/\D/g, "").slice(0, 4);

// פונקציה שמזהה סוג כרטיס לפי הספרות הראשונות:
// Visa / Mastercard / American Express / Discover
const detectCardBrand = (cardNumber) => {
  const digits = cardNumber.replace(/\s/g, "");

  if (/^4/.test(digits)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "American Express";
  if (/^6/.test(digits)) return "Discover";

  return "Card";
};

// פונקציה שמוודאת שהטופס תקין לפני תשלום:
// בודקת שם, מספר כרטיס, תוקף, CVV ותוקף כרטיס בזמן אמת
export const validateCardForm = ({ cardholderName, cardNumber, expiry, cvv }) => {
  if (!cardholderName.trim()) return "Cardholder name is required.";

  if (cardNumber.replace(/\s/g, "").length !== 16)
    return "Enter a valid 16-digit card number.";

  if (!/^\d{2}\/\d{2}$/.test(expiry))
    return "Enter expiry in MM/YY format.";

  const [month, year] = expiry.split("/").map((part) => Number(part));

  if (month < 1 || month > 12)
    return "Enter a valid expiry month.";

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return "This card appears to be expired.";
  }

  if (cvv.length < 3)
    return "Enter a valid CVV.";

  return null;
};

// פונקציה שמחליטה איזה ניקוי לבצע לפי השדה בטופס:
// משמשת בזמן הקלדה כדי לעצב input בזמן אמת
export const formatCardField = (field, value) => {
  if (field === "cardNumber") return normalizeCardNumber(value);
  if (field === "expiry") return normalizeExpiry(value);
  if (field === "cvv") return normalizeCvv(value);
  return value;
};

// קומפוננטת Payment Modal:
// מציגה מסך תשלום מלא עבור מנוי / תוכנית
// כולל תצוגת כרטיס, טופס תשלום, ולידציה וכפתורי פעולה
export default function PaymentModal({
  plan,
  cardForm,
  isBusy,
  onClose,
  onChange,
  onConfirm,
}) {
  // מזהה סוג כרטיס לפי המספר שהוזן
  const cardBrand = detectCardBrand(cardForm.cardNumber);

  // בודק אם יש שגיאה בטופס
  const validationMessage = validateCardForm(cardForm);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

      {/* קונטיינר ראשי של המודל */}
      <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.25)]">

        {/* חלוקה לשני צדדים: תצוגה + טופס */}
        <div className="grid md:grid-cols-[1.1fr_0.9fr]">

          {/* צד שמאל: תצוגת תשלום */}
          <div className="bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_50%,#334155_100%)] p-8 text-white">

            {/* כותרת */}
            <p className="mb-2 text-sm uppercase tracking-[0.28em] text-slate-300">
              Checkout
            </p>

            {/* שם התוכנית */}
            <h2 className="mb-3 text-3xl font-bold">{plan.name}</h2>

            {/* הסבר */}
            <p className="mb-8 max-w-md text-slate-300">
              Complete payment to activate this membership. Once it is paid, the plan becomes active and cannot be changed while it is still active.
            </p>

            {/* תצוגת כרטיס ויזואלית */}
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-xl">

              {/* כותרת קטנה של preview */}
              <div className="mb-6 flex items-start justify-between">

                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.3em] text-slate-300">
                    Card preview
                  </p>

                  {/* סוג כרטיס */}
                  <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                    {cardBrand}
                  </div>
                </div>

                <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80">
                  Secure checkout
                </div>
              </div>

              {/* מספר כרטיס */}
              <p className="mb-6 text-2xl font-semibold tracking-[0.28em]">
                {cardForm.cardNumber || "1234 5678 9012 3456"}
              </p>

              {/* שם ותוקף */}
              <div className="flex items-end justify-between">

                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    Cardholder
                  </p>
                  <p className="text-sm">
                    {cardForm.cardholderName || "YOUR NAME"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    Expires
                  </p>
                  <p className="text-sm">
                    {cardForm.expiry || "MM/YY"}
                  </p>
                </div>

              </div>
            </div>

            {/* סיכום תשלום */}
            <div className="mt-8 rounded-[1.5rem] bg-white/5 p-5">

              <div className="mb-3 flex items-center justify-between text-slate-200">
                <span>Plan</span>
                <span className="font-medium">{plan.name}</span>
              </div>

              <div className="mb-3 flex items-center justify-between text-slate-200">
                <span>Duration</span>
                <span className="font-medium">{plan.durationDays} days</span>
              </div>

              <div className="flex items-center justify-between text-xl font-semibold text-white">
                <span>Total</span>
                <span>NIS {plan.price}</span>
              </div>

            </div>
          </div>

          {/* צד ימין: טופס תשלום */}
          <div className="p-6 md:p-8">

            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-slate-500">
              Payment details
            </p>

            <h3 className="mb-2 text-2xl font-bold text-slate-900">
              Card information
            </h3>

            <p className="mb-6 text-slate-600">
              Enter your payment details below to continue.
            </p>

            {/* טופס */}
            <div className="grid gap-4">

              {/* שם בעל כרטיס */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Cardholder name
                </span>

                <input
                  type="text"
                  value={cardForm.cardholderName}
                  onChange={(e) => onChange("cardholderName", e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                />
              </label>

              {/* מספר כרטיס */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Card number
                </span>

                <div className="flex items-center rounded-2xl border border-slate-300 px-4 py-3 transition focus-within:border-slate-500">

                  <input
                    type="text"
                    value={cardForm.cardNumber}
                    onChange={(e) => onChange("cardNumber", e.target.value)}
                    className="w-full outline-none"
                  />

                  <span className="ml-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {cardBrand}
                  </span>

                </div>
              </label>

              {/* תוקף + CVV */}
              <div className="grid grid-cols-2 gap-4">

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Expiry
                  </span>

                  <input
                    type="text"
                    value={cardForm.expiry}
                    onChange={(e) => onChange("expiry", e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    CVV
                  </span>

                  <input
                    type="password"
                    value={cardForm.cvv}
                    onChange={(e) => onChange("cvv", e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                  />
                </label>

              </div>

              {/* הודעת הסבר */}
              <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                This form validates payment details before submission.
              </div>

              {/* שגיאות */}
              {validationMessage ? (
                <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800">
                  {validationMessage}
                </div>
              ) : null}

            </div>

            {/* כפתורים */}
            <div className="mt-8 flex gap-3">

              <button
                onClick={onClose}
                className="flex-1 rounded-2xl border border-slate-300 px-4 py-3"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                disabled={isBusy}
                className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-white"
              >
                {isBusy ? "Processing..." : "Pay now"}
              </button>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}