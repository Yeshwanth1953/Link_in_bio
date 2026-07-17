import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch user's links
    const links = await prisma.link.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        url: true,
      },
    });

    const linkIds = links.map((l) => l.id);

    // Fetch all clicks for the user's links
    const clicks = await prisma.click.findMany({
      where: {
        linkId: { in: linkIds },
      },
      select: {
        linkId: true,
        createdAt: true,
      },
    });

    // Calculate total clicks
    const totalClicks = clicks.length;

    // Calculate clicks per link
    const clicksPerLink = links.map((link) => {
      const count = clicks.filter((c) => c.linkId === link.id).length;
      return {
        id: link.id,
        title: link.title,
        url: link.url,
        clicks: count,
      };
    });

    // Sort links by clicks descending
    clicksPerLink.sort((a, b) => b.clicks - a.clicks);

    // Calculate daily clicks (last 7 days)
    const dailyClicks: { [date: string]: number } = {};
    
    // Initialize last 7 days with 0 clicks
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dailyClicks[dateString] = 0;
    }

    clicks.forEach((click) => {
      const dateString = new Date(click.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      // Only include it if it's in our last 7 days window (to keep the graph looking clean)
      if (dateString in dailyClicks) {
        dailyClicks[dateString]++;
      }
    });

    const chartData = Object.entries(dailyClicks).map(([date, count]) => ({
      date,
      clicks: count,
    }));

    return NextResponse.json({
      totalClicks,
      clicksPerLink,
      dailyClicks: chartData,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
