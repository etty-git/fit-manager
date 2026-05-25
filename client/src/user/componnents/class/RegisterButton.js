import React from "react";
import { useSelector } from "react-redux";

export default function RegisterButton({ lesson, onRegister }) {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const isAuthenticated = Boolean(token && user);

  const handleClick = () => {
    if (!isAuthenticated) {
      alert("Please log in before booking a class.");
      return;
    }

    onRegister(lesson);
  };

  return (
    <button
      onClick={handleClick}
      className="mt-6 w-full rounded-md bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700"
    >
      Pay and book
    </button>
  );
}
