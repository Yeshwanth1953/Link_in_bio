import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PublicProfileClient from "./PublicProfileClient";

interface PageProps {
  params: Promise<{ username: string }> | { username: string };
}

export default async function PublicProfilePage({ params }: PageProps) {
  // Await params for Next.js 15+ promise dynamic parameters compatibility
  const resolvedParams = await params;
  const username = resolvedParams.username?.toLowerCase();

  if (!username) {
    notFound();
  }

  // Fetch creator and their active links
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      links: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
    },
  });

  // If user does not exist, trigger the 404 page
  if (!user) {
    notFound();
  }

  const profile = {
    name: user.name || "",
    username: user.username || "",
    bio: user.bio || "",
    image: user.image,
    theme: user.theme,
  };

  const links = user.links.map((link) => ({
    id: link.id,
    title: link.title,
    url: link.url,
  }));

  return <PublicProfileClient profile={profile} links={links} />;
}
export const dynamic = "force-dynamic";
export const revalidate = 0;
