import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import { Lowongan } from "@/models/Lowongan";

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
    const formFields = body.formFields;

    if (!Array.isArray(formFields)) {
      return NextResponse.json({ error: "Format data formulir tidak valid" }, { status: 400 });
    }

    await dbConnect();

    const updated = await Lowongan.findByIdAndUpdate(
      id,
      {
        formFields: formFields,
        "updatedBy.name": session.user.name || "Unknown",
        "updatedBy.discordId": session.user.discordId || "Unknown",
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Lowongan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PUT Lowongan Form Error:", error);
    return NextResponse.json({ error: error.message || "Gagal menyimpan formulir" }, { status: 500 });
  }
}
