// app/api/auth/forgot-password/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "No user found with this email" }, { status: 404 });
    }

    // Generate simple token (for demo, production should use JWT/crypto)
    const token = Math.random().toString(36).substring(2, 15);
    
    await prisma.user.update({
      where: { email },
      data: { resetToken: token, resetTokenExpiry: new Date(Date.now() + 3600000) } // 1 hour expiry
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${token}&email=${email}`;

    await transporter.sendMail({
      from: `"SelfBoss Foundation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested to reset your password. <a href="${resetUrl}">Click here</a> to reset it.</p>`
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
