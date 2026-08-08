import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import { Application } from "@/models/Application";
import { Lowongan } from "@/models/Lowongan";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { lowonganId, answers } = body;

    if (!lowonganId || !answers) {
      return NextResponse.json({ error: "Data pendaftaran tidak lengkap" }, { status: 400 });
    }

    await dbConnect();

    const lowongan = await Lowongan.findById(lowonganId);
    if (!lowongan || lowongan.status !== "Open") {
      return NextResponse.json({ error: "Lowongan tidak tersedia atau sudah ditutup." }, { status: 400 });
    }

    // Cek apakah user memiliki lamaran aktif atau sudah diterima untuk posisi ini
    const existingApp = await Application.findOne({
      lowonganId,
      "applicant.discordId": session.user.discordId as string,
      status: { $in: ["Pending", "Reviewed", "Accepted"] }
    });
    
    if (existingApp) {
      if (existingApp.status === "Accepted") {
        return NextResponse.json({ error: "Anda tidak dapat melamar karena Anda sudah diterima dan saat ini berada di posisi tersebut." }, { status: 400 });
      }
      return NextResponse.json({ error: "Anda masih memiliki lamaran aktif untuk posisi ini yang sedang diproses." }, { status: 400 });
    }

    // Hitung nomor urut pendaftaran untuk posisi ini
    const count = await Application.countDocuments({ lowonganId });
    const urutan = count + 1;

    // Bersihkan nama channel dari karakter non-alfanumerik
    const rawChannelName = `pendaftaran-${session.user.name}-${lowongan.title}-${urutan}`;
    const channelName = rawChannelName
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 100);

    let discordChannelId = undefined;

    // Integrasi Discord: Buat Channel Interview
    if (
      process.env.DISCORD_BOT_TOKEN &&
      process.env.DISCORD_GUILD_ID &&
      process.env.DISCORD_REGISTER_CATEGORY_ID &&
      process.env.DISCORD_MANAGER_ROLE_ID
    ) {
      try {
        const discordRes = await fetch(
          `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/channels`,
          {
            method: "POST",
            headers: {
              Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: channelName,
              type: 0, // 0 = GUILD_TEXT
              parent_id: process.env.DISCORD_REGISTER_CATEGORY_ID,
              permission_overwrites: [
                {
                  id: process.env.DISCORD_GUILD_ID, // ID @everyone sama dengan Guild ID
                  type: 0, // Role
                  deny: "1024", // Deny VIEW_CHANNEL
                },
                {
                  id: session.user.discordId,
                  type: 1, // Member
                  allow: "1024", // Allow VIEW_CHANNEL
                },
                {
                  id: process.env.DISCORD_MANAGER_ROLE_ID,
                  type: 0, // Role
                  allow: "1024", // Allow VIEW_CHANNEL
                },
              ],
            }),
          }
        );

        if (discordRes.ok) {
          const discordData = await discordRes.json();
          discordChannelId = discordData.id;
        } else {
          console.error("Gagal membuat channel discord:", await discordRes.text());
        }
      } catch (discordErr) {
        console.error("Error memanggil API Discord:", discordErr);
      }
    }

    const application = new Application({
      lowonganId,
      lowonganTitle: lowongan.title,
      applicant: {
        discordId: session.user.discordId,
        name: session.user.name,
        email: session.user.email,
      },
      answers,
      status: "Pending",
      discordChannelId,
    });

    await application.save();

    // Kirim pesan sambutan ke channel discord yang baru dibuat
    if (discordChannelId && process.env.DISCORD_BOT_TOKEN) {
      try {
        const appUrl = `${process.env.NEXTAUTH_URL}/dashboard/lamaran/${application._id}`;
        await fetch(
          `https://discord.com/api/v10/channels/${discordChannelId}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: `Halo <@${session.user.discordId}>, terima kasih telah mendaftar! Mohon tunggu kehadiran <@&${process.env.DISCORD_MANAGER_ROLE_ID}> untuk merespon lamaran Anda.`,
              embeds: [
                {
                  title: `Pendaftaran Baru: ${lowongan.title}`,
                  description: "Pelamar telah menyelesaikan pengisian formulir pendaftaran di website. Informasi detail dapat diakses melalui tombol di bawah.",
                  color: 2190166, // Warna primer (#216BD6)
                }
              ],
              components: [
                {
                  type: 1,
                  components: [
                    {
                      type: 2,
                      style: 5, // Link
                      label: "Buka Lamaran (Manager Only)",
                      url: appUrl
                    }
                  ]
                }
              ]
            }),
          }
        );
      } catch (msgErr) {
        console.error("Gagal mengirim pesan sambutan ke Discord:", msgErr);
      }
    }

    return NextResponse.json({ success: true, message: "Berhasil mengirimkan lamaran!" }, { status: 201 });
  } catch (error: any) {
    console.error("Apply Error:", error);
    return NextResponse.json({ error: error.message || "Terjadi kesalahan saat mengirim lamaran" }, { status: 500 });
  }
}
