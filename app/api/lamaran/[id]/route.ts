import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import { Application } from "@/models/Application";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const lamaranId = (await params).id;

    const application = await Application.findById(lamaranId).lean();

    if (!application) {
      return NextResponse.json({ error: "Lamaran tidak ditemukan" }, { status: 404 });
    }

    // Hanya izinkan manajer/admin atau pemilik lamaran itu sendiri
    const isManager = session.user.role === "manager" || session.user.role === "admin";
    const isOwner = application.applicant.discordId === session.user.discordId;

    if (!isManager && !isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        ...application,
        discordGuildId: process.env.DISCORD_GUILD_ID 
      } 
    });
  } catch (error: any) {
    console.error("GET Lamaran Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "manager" && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, payload } = body;

    await dbConnect();
    const lamaranId = (await params).id;

    const application = await Application.findById(lamaranId);
    if (!application) {
      return NextResponse.json({ error: "Lamaran tidak ditemukan" }, { status: 404 });
    }

    // Helper untuk mengirim pesan via Bot Discord
    const sendDiscordMessage = async (channelId: string, content: string) => {
      if (!process.env.DISCORD_BOT_TOKEN) return;
      try {
        await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
          method: "POST",
          headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        });
      } catch (err) {
        console.error("Gagal mengirim pesan Discord:", err);
      }
    };

    if (action === "CLAIM") {
      application.claimedBy = {
        discordId: session.user.discordId,
        name: session.user.name || "Manager",
      };
      application.status = "Reviewed";
      await application.save();

      if (application.discordChannelId) {
        const msg = `Halo <@${application.applicant.discordId}>! Lamaran Anda telah diterima dan saat ini sedang ditangani oleh <@${session.user.discordId}>. Silakan tunggu instruksi selanjutnya atau gunakan channel ini untuk bertanya kepada manajer.`;
        await sendDiscordMessage(application.discordChannelId, msg);
      }

      return NextResponse.json({ success: true, data: application });
    }

    if (action === "EDIT_ANSWERS") {
      if (!payload || !payload.answers) {
        return NextResponse.json({ error: "Data jawaban tidak valid" }, { status: 400 });
      }
      application.answers = payload.answers;
      await application.save();
      return NextResponse.json({ success: true, data: application });
    }

    if (action === "ACCEPT" || action === "REJECT") {
      if (!payload || !payload.reason) {
        return NextResponse.json({ error: "Alasan wajib diisi" }, { status: 400 });
      }
      application.status = action === "ACCEPT" ? "Accepted" : "Rejected";
      application.reason = payload.reason;
      await application.save();

      if (application.discordChannelId) {
        const title = action === "ACCEPT" ? "🎉 SELAMAT! LAMARAN DITERIMA" : "❌ MOHON MAAF, LAMARAN DITOLAK";
        const msg = `<@${application.applicant.discordId}>\n**${title}**\n\n**Keputusan oleh:** <@${session.user.discordId}>\n**Catatan Tambahan:** ${payload.reason}`;
        await sendDiscordMessage(application.discordChannelId, msg);
      }

      return NextResponse.json({ success: true, data: application });
    }

    return NextResponse.json({ error: "Aksi tidak dikenali" }, { status: 400 });
  } catch (error: any) {
    console.error("PUT Lamaran Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
