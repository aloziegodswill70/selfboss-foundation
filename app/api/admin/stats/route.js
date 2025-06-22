import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const adminCount = await prisma.user.count({ where: { role: "admin" } });
    const messageCount = await prisma.message.count();

    return NextResponse.json({ admins: adminCount, messages: messageCount });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
