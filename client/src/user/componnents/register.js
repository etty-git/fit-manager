import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "../../features/auth/authApi";
import { setUser } from "../../features/auth/authSlice";
import { showNotification } from "../../features/ui/uiSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [register] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await register({
        name,
        username,
        email,
        phone,
        password,
      }).unwrap();

      dispatch(setUser({ user: res.user, token: res.token }));
      navigate("/plans");
    } catch (err) {
      dispatch(
        showNotification({
          type: "error",
          title: "Register failed",
          message: err?.data?.message || err?.data?.error || "Register failed",
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
        <h2 className="mb-4 text-2xl font-black text-slate-950">Create account</h2>

        <input placeholder="Name" className="mb-3 w-full rounded-md border border-slate-300 p-3" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Username" className="mb-3 w-full rounded-md border border-slate-300 p-3" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" className="mb-3 w-full rounded-md border border-slate-300 p-3" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Phone" className="mb-3 w-full rounded-md border border-slate-300 p-3" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input type="password" placeholder="Password" className="mb-3 w-full rounded-md border border-slate-300 p-3" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit" className="w-full rounded-md bg-emerald-600 p-3 font-semibold text-white transition hover:bg-emerald-700">
          Register
        </button>

        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-emerald-700">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
