import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { title, url } = await req.json();

    if (!title || !url) {
      return NextResponse.json({ error: "Title and URL are required" }, { status: 400 });
    }

    // Get current max order to append the new link at the end
    const lastLink = await prisma.link.findFirst({
      where: { userId },
      orderBy: { order: "desc" },
    });

    const nextOrder = lastLink ? lastLink.order + 1 : 0;

    const newLink = await prisma.link.create({
      data: {
        userId,
        title,
        url,
        order: nextOrder,
        isActive: true,
      },
    });

    return NextResponse.json(newLink, { status: 201 });
  } catch (error) {
    console.error("Link creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
