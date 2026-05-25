// ================================
// React state + hooks
// ================================
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// ================================
// RTK Query - API calls
// ================================
import { useGetMyMembershipQuery, useGetPlansQuery } from "../../features/plans/plansApi";
import { useCreatePaymentMutation, usePayPaymentMutation } from "../../features/payments/paymentsApi";

// ================================
// UI notifications (Redux slice)
// ================================
import { showNotification } from "../../features/ui/uiSlice";

// ================================
// Components
// ================================
import PaymentModal, { formatCardField, validateCardForm } from "./plans/PaymentModal";
import PlanCard from "./plans/PlanCard";
import PlansHero from "./plans/PlansHero";
import MembershipStatusCard from "./plans/MembershipStatusCard";

// ================================
// Local storage helpers
// ================================
import { loadStoredJson, removeStoredJson, saveStoredJson, storageKeys } from "../../utils/storage";

// ================================
// טופס כרטיס אשראי ריק (מצב התחלתי)
// ================================
const initialCardForm = {
  cardholderName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

export default function PlansPage() {

  // ================================
  // Redux state (משתמש מחובר)
  // ================================
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  // ================================
  // מצב מקומי של הקומפוננטה
  // ================================
  const [selectedPlan, setSelectedPlan] = useState(null); // איזה מסלול נבחר
  const [cardForm, setCardForm] = useState(initialCardForm); // טופס תשלום

  // ================================
  // מנוי שמור ב-localStorage
  // ================================
  const storedMembership = loadStoredJson(storageKeys.membership, null);

  // האם המשתמש מחובר
  const isAuthenticated = Boolean(token && authUser);

  // ================================
  // שליפת נתונים מהשרת (RTK Query)
  // ================================
  const { data: plans = [], isLoading, isError, error, refetch } = useGetPlansQuery();

  const { data: membership, isLoading: isMembershipLoading } =
    useGetMyMembershipQuery(undefined, {
      skip: !isAuthenticated,
    });

  const [createPayment, { isLoading: isCreatingPayment }] = useCreatePaymentMutation();
  const [payPayment, { isLoading: isPayingPayment }] = usePayPaymentMutation();

  // ================================
  // מנוי פעיל (שרת או localStorage)
  // ================================
  const effectiveMembership = membership || (isAuthenticated ? storedMembership : null);

  const hasActiveMembership =
    effectiveMembership?.plan &&
    effectiveMembership?.status === "Active" &&
    (!effectiveMembership?.end || new Date(effectiveMembership.end) > new Date());

  // ================================
  // מזהה מסלול פעיל
  // ================================
  const activePlanId = hasActiveMembership ? effectiveMembership?.plan?._id : null;

  // ================================
  // מיון מסלולים לפי רמות
  // ================================
  const sortedPlans = useMemo(() => {
    const order = { Basic: 1, Premium: 2, VIP: 3 };
    return [...plans].sort((a, b) => (order[a.name] || 99) - (order[b.name] || 99));
  }, [plans]);

  // ================================
  // שמירת מנוי ב-localStorage
  // ================================
  useEffect(() => {
    if (membership && isAuthenticated) {
      saveStoredJson(storageKeys.membership, membership);
    }
  }, [isAuthenticated, membership]);

  // ================================
  // מחיקת מנוי אם המשתמש התנתק
  // ================================
  useEffect(() => {
    if (!isAuthenticated && storedMembership) {
      removeStoredJson(storageKeys.membership);
    }
  }, [isAuthenticated, storedMembership]);

  // ================================
  // בחירת מסלול
  // ================================
  const handleSelectPlan = (plan) => {
    if (!isAuthenticated || hasActiveMembership) return;

    setSelectedPlan(plan);
    setCardForm(initialCardForm);
  };

  // ================================
  // סגירת חלון תשלום
  // ================================
  const handleClosePayment = () => {
    setSelectedPlan(null);
    setCardForm(initialCardForm);
  };

  // ================================
  // עדכון שדות טופס כרטיס
  // ================================
  const handleCardFieldChange = (field, value) => {
    setCardForm((current) => ({
      ...current,
      [field]: formatCardField(field, value),
    }));
  };

  // ================================
  // ביצוע תשלום בפועל
  // ================================
  const handleConfirmPayment = async () => {
    if (!selectedPlan || !isAuthenticated) {
      if (!isAuthenticated) {
        dispatch(
          showNotification({
            type: "error",
            title: "Login required",
            message: "You must be logged in before completing a payment.",
          })
        );
      }
      return;
    }

    // בדיקת תקינות כרטיס
    const validationError = validateCardForm(cardForm);

    if (validationError) {
      dispatch(
        showNotification({
          type: "error",
          title: "Check payment details",
          message: validationError,
        })
      );
      return;
    }

    try {
      // יצירת תשלום
      const createdPayment = await createPayment({
        type: "PLAN",
        planId: selectedPlan._id,
      }).unwrap();

      const paymentId = createdPayment?.payment?._id;

      // חיוב בפועל
      await payPayment(paymentId).unwrap();

      // הודעת הצלחה
      dispatch(
        showNotification({
          type: "success",
          title: "Payment completed",
          message: `Your ${selectedPlan.name} plan is now active.`,
        })
      );

      // שמירה מקומית
      saveStoredJson(storageKeys.membership, {
        plan: {
          _id: selectedPlan._id,
          name: selectedPlan.name,
        },
        status: "Active",
      });

      handleClosePayment();
    } catch (paymentError) {
      dispatch(
        showNotification({
          type: "error",
          title: "Payment failed",
          message:
            paymentError?.data?.message ||
            paymentError?.data?.error ||
            "We could not complete the payment.",
        })
      );
    }
  };

  // ================================
  // טעינה
  // ================================
  if (isLoading || isMembershipLoading) {
    return <div className="py-12 text-center text-gray-700">Loading plans...</div>;
  }

  // ================================
  // שגיאה
  // ================================
  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 text-red-600">
          {error?.data?.message || error?.data?.error || "Failed to load plans"}
        </p>
        <button
          type="button"
          onClick={refetch}
          className="rounded-xl bg-blue-600 px-4 py-2 text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  // ================================
  // UI ראשי
  // ================================
  return (
    <section className="py-6">

      {/* כותרת */}
      <PlansHero />

      {/* סטטוס מנוי */}
      <MembershipStatusCard
        hasActiveMembership={hasActiveMembership}
        membership={effectiveMembership}
        isLoggedIn={isAuthenticated}
      />

      {/* רשימת מסלולים */}
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
        {sortedPlans.map((plan) => (
          <PlanCard
            key={plan._id}
            plan={plan}
            isActivePlan={activePlanId === plan._id}
            selectionLocked={hasActiveMembership && activePlanId !== plan._id}
            isLoggedIn={isAuthenticated}
            isBusy={isCreatingPayment || isPayingPayment}
            onSelect={handleSelectPlan}
          />
        ))}
      </div>

      {/* חלון תשלום */}
      {selectedPlan && isAuthenticated ? (
        <PaymentModal
          plan={selectedPlan}
          cardForm={cardForm}
          isBusy={isCreatingPayment || isPayingPayment}
          onClose={handleClosePayment}
          onChange={handleCardFieldChange}
          onConfirm={handleConfirmPayment}
        />
      ) : null}
    </section>
  );
}