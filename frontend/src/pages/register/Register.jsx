import React, { useState } from "react";
import { Link } from "react-router";
import { useAuthStore } from "../../store/authUser"

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });
  const [localError, setLocalError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {register,isRegistered} = useAuthStore(); 

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!form.username || !form.fullName || !form.email || !form.password) {
      setLocalError("Please fill in all fields.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setLocalError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    try {
      setSubmitting(true);
      await register({
        username: form.username.trim(),
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
      });
    } catch (err) {
      setLocalError(err?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false); 
    }
  };

  if(isRegistered){
    return (<div>Loading...</div>)
  }

  return (
    <div className="min-h-screen p-8 relative z-0 mt-5 flex items-start md:items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create account</h1>
          <p className="text-gray-300 text-lg">Join and save your time.</p>
        </div>

        <div className="">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Username</label>
              <input
                name="username"
                value={form.username}
                onChange={onChange}
                placeholder="Username"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#52D3D8]"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Full name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={onChange}
                placeholder="Full Name"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#52D3D8]"
                autoComplete="name"
              />
            </div>

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
                autoComplete="new-password"
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
              {isRegistered ? "Creating account..." : "Register"}
            </button>

            <p className="text-center text-gray-300 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-[#52D3D8] hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
