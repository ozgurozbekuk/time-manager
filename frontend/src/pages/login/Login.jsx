import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuthStore } from "../../store/authUser"; 

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {login,isLoggingIn} = useAuthStore();     
  
  const navigate = useNavigate()
  const location = useLocation();
  const from = location.state?.from?.pathname || "/profile";

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!form.email || !form.password) {
      setLocalError("Please fill in all fields.");
      return;
    }
    try {
      setSubmitting(true);
      await login({ email: form.email.trim(), password: form.password });
      navigate(from, { replace: true });
    } catch (err) {
      setLocalError(err?.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if(isLoggingIn){
    return (<div>Loading...</div>)
  }

  return (
    <div className="min-h-screen p-8 relative z-0 mt-5 flex items-start md:items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-300 text-lg">Log in to continue.</p>
        </div>

        <div>
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@example.com"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#52D3D8]"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#52D3D8]"
                autoComplete="current-password"
              />
            </div>

            {(localError) && (
              <div className="rounded-lg bg-red-500/10 border border-red-400/30 px-3 py-2 text-sm text-red-200">
                {localError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl px-4 py-3 font-semibold bg-[#52D3D8] text-slate-900 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {isLoggingIn ? "Loggining..." : "Login"}
            </button>

            <p className="text-center text-gray-300 text-sm">
              Don’t have an account?{" "}
              <Link to="/register" className="text-[#52D3D8] hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
