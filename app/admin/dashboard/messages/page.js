// app/admin/dashboard/messages/page.js

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminMessagesPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>Access Denied</p>
      </div>
    );
  }

  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gold mb-6">Contact Submissions</h1>
        <Link href="/admin/dashboard" className="text-sm underline text-gold mb-4 inline-block">← Back to Dashboard</Link>
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gold">
              <thead className="bg-gold text-black">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Subject</th>
                  <th className="px-4 py-2 text-left">Message</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr key={msg.id} className="border-t border-gold">
                    <td className="px-4 py-2">{msg.name}</td>
                    <td className="px-4 py-2">{msg.email}</td>
                    <td className="px-4 py-2">{msg.subject}</td>
                    <td className="px-4 py-2">{msg.body}</td>
                    <td className="px-4 py-2 text-sm">{new Date(msg.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
