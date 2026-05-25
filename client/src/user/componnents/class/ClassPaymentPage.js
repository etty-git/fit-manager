import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useCreatePaymentMutation, usePayPaymentMutation } from "../../../features/payments/paymentsApi";
import { showNotification } from "../../../features/ui/uiSlice";

import PaymentModal, { validateCardForm } from "../../componnents/plans/PaymentModal";

export default function ClassPaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const lesson = state?.lesson;
  const bookingId = state?.bookingId;

  const [cardForm, setCardForm] = useState({
    cardholderName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [createPayment] = useCreatePaymentMutation();
  const [payPayment] = usePayPaymentMutation();

  const handleChange = (field, value) => {
    setCardForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePay = async () => {
    try {
      const error = validateCardForm(cardForm);
      if (error) {
        dispatch(showNotification({ type: "error", title: "Error", message: error }));
        return;
      }

      // 1️⃣ create payment
      const res = await createPayment({
        type: "CLASS",
        classId: lesson._id,
        bookingId: bookingId,
      }).unwrap();

      // 2️⃣ pay
      await payPayment({ paymentId: res.payment._id }).unwrap();

      dispatch(
        showNotification({
          type: "success",
          title: "Success",
          message: "נרשמת לשיעור בהצלחה!",
        })
      );

      navigate("/classes");
    } catch (err) {
      dispatch(
        showNotification({
          type: "error",
          title: "Payment failed",
          message: err?.data?.error || "Error occurred",
        })
      );
    }
  };

  return (
    <PaymentModal
      plan={lesson}
      cardForm={cardForm}
      onChange={handleChange}
      onConfirm={handlePay}
      onClose={() => navigate(-1)}
      isBusy={false}
    />
  );
}