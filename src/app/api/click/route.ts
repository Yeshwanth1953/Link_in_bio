import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { linkId } = await req.json();

    if (!linkId) {
      return NextResponse.json({ error: "Link ID is required" }, { status: 400 });
    }

    // Verify that the link exists
    const linkExists = await prisma.link.findUnique({
      where: { id: linkId },
    });

    if (!linkExists) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // Create a new Click record
    await prisma.click.create({
      data: {
        linkId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Click tracking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
