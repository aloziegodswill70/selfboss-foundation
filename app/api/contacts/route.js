// app/api/contact/route.js

import prisma from "@/lib/prisma";



export async function POST(req) {
  try {
    const { name, email, subject, body } = await req.json();

    if (!name || !email || !subject || !body) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
      });
    }

    await prisma.message.create({
      data: {
        name,
        email,
        subject,
        body,
      },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
