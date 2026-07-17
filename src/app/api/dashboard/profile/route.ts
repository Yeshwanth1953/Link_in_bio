import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { name, bio, image, theme, username } = body;

    // Validate inputs if specified
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (image !== undefined) updateData.image = image; // Can be base64 string
    if (theme !== undefined) updateData.theme = theme;

    if (username !== undefined) {
      // Validate username format (alphanumeric, hyphens, underscores)
      const usernameRegex = /^[a-zA-Z0-9_-]+$/;
      if (!usernameRegex.test(username)) {
        return NextResponse.json(
          { error: "Username can only contain letters, numbers, hyphens, and underscores" },
          { status: 400 }
        );
      }

      if (username.length < 3) {
        return NextResponse.json(
          { error: "Username must be at least 3 characters long" },
          { status: 400 }
        );
      }

      // Check uniqueness of username
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 400 }
        );
      }

      updateData.username = username.toLowerCase();
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        username: true,
        bio: true,
        theme: true,
      },
    });

    return NextResponse.json({ message: "Profile updated successfully", profile: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
