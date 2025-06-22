"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function DashboardPage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ admins: 0, messages: 0 });
  const router = useRouter();

  useEffect(() => {
    async function fetchSession() {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (!data || !data.user || data.user.role !== "admin") {
        router.push("/admin/login");
      } else {
        setSession(data);
      }
      setLoading(false);
    }

    async function fetchStats() {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    }

    fetchSession();
    fetchStats();
  }, [router]);

  if (loading) return <div className="p-6 text-gold">Loading...</div>;

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gold">Admin Dashboard</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gold text-white p-6 rounded shadow">
          <h2 className="text-lg font-bold">Total Admins</h2>
          <p className="text-2xl">{stats.admins}</p>
        </div>
        <div className="bg-gold text-white p-6 rounded shadow">
          <h2 className="text-lg font-bold">Contact Messages</h2>
          <p className="text-2xl">{stats.messages}</p>
        </div>
      </div>
    </div>
  );
}
