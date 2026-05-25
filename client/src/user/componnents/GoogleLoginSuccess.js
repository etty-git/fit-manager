import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setUser } from "../../features/auth/authSlice";
import { showNotification } from "../../features/ui/uiSlice";
import { getHomePathForRole } from "../../utils/roleRedirect";

const parseJwtPayload = (token) => {
  try {
    const base64 = token.split(".")[1];
    const normalized = base64.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "="
    );
    return JSON.parse(window.atob(padded));
  } catch {
    return null;
  }
};

export default function GoogleLoginSuccess() {
  useEffect(() => {
  console.log("LOGIN SUCCESS PAGE RENDERED");
}, []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get("token");

    if (!token) {
      dispatch(
        showNotification({
          type: "error",
          title: "Google login failed",
          message: "We could not complete the Google login flow.",
        })
      );
      navigate("/login");
      return;
    }

    const payload = parseJwtPayload(token);

    const user = payload
      ? {
          id: payload.id,
          name: payload.name,
          username: payload.username,
          email: payload.email,
          role: payload.role,
        }
      : null;

    dispatch(setUser({ user, token }));

    dispatch(
      showNotification({
        type: "success",
        title: "Welcome",
        message: "You are now logged in.",
      })
    );

    const role = user?.role || "guest";
    navigate(getHomePathForRole(role));
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="flex justify-center mt-20">
      <div className="bg-white p-6 rounded shadow text-center">
        Connecting with Google...
      </div>
    </div>
  );
}