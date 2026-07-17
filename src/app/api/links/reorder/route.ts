import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { linkIds } = await req.json();

    if (!linkIds || !Array.isArray(linkIds)) {
      return NextResponse.json({ error: "linkIds must be an array of string IDs" }, { status: 400 });
    }

    // Perform bulk updates in a transaction
    const updates = linkIds.map((id: string, index: number) =>
      prisma.link.update({
        where: { id, userId }, // Ensure the link belongs to this user
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);

    return NextResponse.json({ message: "Links reordered successfully" });
  } catch (error) {
    console.error("Reorder links error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
