"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus({ type: "error", message: "Missing or invalid token" });
    }
  }, [token]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setStatus({ type: "error", message: "Passwords do not match" });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: "Password reset successful. Redirecting..." });
        setTimeout(() => router.push("/admin/login"), 3000);
      } else {
        setStatus({ type: "error", message: data.error || "Reset failed" });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Network error" });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gold">Reset Password</h1>
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-black font-semibold mb-1">New Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">Confirm Password</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-white py-2 rounded-md hover:bg-yellow-600 transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          {status && (
            <p className={`text-sm mt-2 ${status.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {status.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-white p-4 text-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
