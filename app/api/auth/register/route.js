// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { email, password, confirmPassword, secretCode } = await req.json();

  if (!email || !password || !confirmPassword || !secretCode) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
  }

  if (secretCode !== process.env.ADMIN_SECRET_CODE) {
    return NextResponse.json({ error: "Invalid secret code" }, { status: 401 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "admin",
    },
  });

  return NextResponse.json({ success: true });
}
