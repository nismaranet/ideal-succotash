import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import { Lowongan } from "@/models/Lowongan";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const lowongan = await Lowongan.findById(id);
    if (!lowongan) {
      return NextResponse.json({ error: "Lowongan tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(lowongan);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user.role !== "manager" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Tidak memiliki akses (Unauthorized)" }, { status: 401 });
    }

    const body = await req.json();
    
    if (!body.title || !body.division || !body.roleType || !body.description || !body.slug) {
      return NextResponse.json({ error: "Data wajib tidak lengkap" }, { status: 400 });
    }

    await dbConnect();

    // Cek slug conflict untuk dokumen SELAIN yang sedang diedit
    const existing = await Lowongan.findOne({ slug: body.slug, _id: { $ne: id } });
    if (existing) {
      return NextResponse.json({ error: "Slug sudah digunakan oleh lowongan lain, silakan ubah." }, { status: 400 });
    }

    let requirementsArray: string[] = [];
    if (typeof body.requirements === "string") {
      requirementsArray = body.requirements
        .split("\n")
        .map((r: string) => r.trim())
        .filter((r: string) => r.length > 0);
    } else if (Array.isArray(body.requirements)) {
      requirementsArray = body.requirements;
    }

    // Hanya update field-field tertentu, jangan biarkan edit ID atau _v dll
    const updated = await Lowongan.findByIdAndUpdate(
      id,
      {
        title: body.title,
        slug: body.slug,
        division: body.division,
        roleType: body.roleType,
        type: body.type,
        location: body.location,
        status: body.status,
        description: body.description,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
        requirements: requirementsArray,
        updatedBy: {
          name: session.user.name || "Unknown",
          discordId: session.user.discordId || "Unknown",
        },
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Lowongan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PUT Lowongan Error:", error);
    return NextResponse.json({ error: error.message || "Gagal mengupdate lowongan" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user.role !== "manager" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Tidak memiliki akses (Unauthorized)" }, { status: 401 });
    }

    await dbConnect();

    const deleted = await Lowongan.findByIdAndDelete(id);
    
    if (!deleted) {
      return NextResponse.json({ error: "Lowongan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Lowongan berhasil dihapus" });
  } catch (error: any) {
    console.error("DELETE Lowongan Error:", error);
    return NextResponse.json({ error: error.message || "Gagal menghapus lowongan" }, { status: 500 });
  }
}
