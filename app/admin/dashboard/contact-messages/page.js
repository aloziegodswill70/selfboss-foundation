"use client";
import { useEffect, useState } from "react";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/contacts");
    const data = await res.json();
    setMessages(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this message?");
    if (!confirm) return;

    setDeletingId(id);
    const res = await fetch(`/api/admin/contacts/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } else {
      alert("Failed to delete message.");
    }

    setDeletingId(null);
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4 text-gold">Contact Messages</h1>
      {loading ? (
        <p>Loading...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-500">No messages found.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="border border-black p-4 rounded-md relative">
              <p><strong>Name:</strong> {msg.name}</p>
              <p><strong>Email:</strong> {msg.email}</p>
              <p><strong>Subject:</strong> {msg.subject}</p>
              <p><strong>Message:</strong> {msg.body}</p>
              <p className="text-sm text-gray-500 mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
              <button
                onClick={() => handleDelete(msg.id)}
                className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
                disabled={deletingId === msg.id}
              >
                {deletingId === msg.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
