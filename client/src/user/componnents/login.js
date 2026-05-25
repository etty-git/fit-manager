import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../features/auth/authApi";
import { setUser } from "../../features/auth/authSlice";
import { API_BASE_URL } from "../../services/api";
import { showNotification } from "../../features/ui/uiSlice";
import { getHomePathForRole } from "../../utils/roleRedirect";

const GOOGLE_AUTH_URL = `${API_BASE_URL}/api/users/auth/google`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setUser({ user: res.user, token: res.token }));
      navigate(getHomePathForRole(res.user?.role));
    } catch (err) {
      dispatch(
        showNotification({
          type: "error",
          title: "Login failed",
          message:
            err?.data?.message ||
            err?.data?.error ||
            err?.error ||
            "Login failed",
        })
      );
    }
  };

  return (
    <div className="flex justify-center px-4 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-2xl font-black text-slate-950">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="mb-3 w-full rounded-md border border-slate-300 p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-3 w-full rounded-md border border-slate-300 p-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full rounded-md bg-emerald-600 p-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          Login
        </button>

        <div className="my-4 text-center text-sm text-slate-500">or</div>

        <button
          type="button"
          onClick={() => {
            window.location.href = GOOGLE_AUTH_URL;
          }}
          className="w-full rounded-md border border-slate-300 bg-white p-3 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Continue with Google
        </button>

        <p className="mt-4 text-sm text-slate-600">
          Do not have an account?{" "}
          <Link to="/register" className="font-semibold text-emerald-700">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
