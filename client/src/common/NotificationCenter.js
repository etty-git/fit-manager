import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearNotification } from "../features/ui/uiSlice";

const typeStyles = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-rose-200 bg-rose-50 text-rose-900",
  info: "border-sky-200 bg-sky-50 text-sky-900",
};

export default function NotificationCenter() {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.ui.notification);

  useEffect(() => {
    if (!notification) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      dispatch(clearNotification());
    }, 3500);

    return () => window.clearTimeout(timeoutId);
  }, [dispatch, notification]);

  if (!notification) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-[100] max-w-sm">
      <div
        className={`rounded-2xl border px-4 py-3 shadow-lg backdrop-blur ${typeStyles[notification.type] || typeStyles.info}`}
      >
        {notification.title ? (
          <p className="mb-1 text-sm font-semibold">{notification.title}</p>
        ) : null}
        <p className="text-sm">{notification.message}</p>
      </div>
    </div>
  );
}
