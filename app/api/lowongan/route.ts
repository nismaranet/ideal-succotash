import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import { Lowongan } from "@/models/Lowongan";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await dbConnect();
    // Ambil data terbaru di paling atas
    const lowongan = await Lowongan.find().sort({ createdAt: -1 });
    return NextResponse.json(lowongan);
  } catch (error) {
    console.error("GET Lowongan Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data lowongan" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // 1. Cek sesi & Otorisasi
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user.role !== "manager" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Tidak memiliki akses (Unauthorized)" }, { status: 401 });
    }

    // 2. Baca data request
    const body = await req.json();
    
    if (!body.title || !body.division || !body.roleType || !body.description || !body.slug) {
      return NextResponse.json({ error: "Data wajib tidak lengkap (termasuk Slug)" }, { status: 400 });
    }

    await dbConnect();

    // Cek apakah slug sudah ada
    const existing = await Lowongan.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json({ error: "Slug sudah digunakan, silakan gunakan slug lain." }, { status: 400 });
    }

    // 3. Proses 'requirements' string (dari textarea) ke array
    let requirementsArray: string[] = [];
    if (typeof body.requirements === "string") {
      requirementsArray = body.requirements
        .split("\n")
        .map((r: string) => r.trim())
        .filter((r: string) => r.length > 0);
    }

    // 4. Hubungkan database
    await dbConnect();
    
    // 5. Buat dan simpan Lowongan
    const lowonganBaru = await Lowongan.create({
      ...body,
      requirements: requirementsArray,
      createdBy: {
        name: session.user.name || "Unknown",
        discordId: session.user.discordId || "Unknown",
      },
    });

    return NextResponse.json(lowonganBaru, { status: 201 });
  } catch (error: any) {
    console.error("POST Lowongan Error:", error);
    return NextResponse.json({ error: error.message || "Terjadi kesalahan internal peladen" }, { status: 500 });
  }
}
