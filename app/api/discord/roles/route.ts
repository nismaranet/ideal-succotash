import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== "manager" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.DISCORD_BOT_TOKEN || !process.env.DISCORD_GUILD_ID) {
      return NextResponse.json({ error: "Discord credentials not configured" }, { status: 500 });
    }

    const discordRes = await fetch(
      `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/roles`,
      {
        method: "GET",
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );

    if (!discordRes.ok) {
      console.error("Gagal mengambil roles discord:", await discordRes.text());
      return NextResponse.json({ error: "Gagal mengambil roles discord" }, { status: 500 });
    }

    const roles = await discordRes.json();
    
    // Sort roles by position descending (Discord API returns lowest to highest)
    roles.sort((a: any, b: any) => b.position - a.position);

    return NextResponse.json({ success: true, data: roles }, { status: 200 });
  } catch (error: any) {
    console.error("GET Roles Error:", error);
    return NextResponse.json({ error: error.message || "Terjadi kesalahan" }, { status: 500 });
  }
}
