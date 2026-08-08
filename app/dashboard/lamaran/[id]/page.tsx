"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Save,
  CheckCircle,
  XCircle,
  HandHeart,
  MessagesSquare,
  Shield,
} from "lucide-react";
import { BackButton } from "@/components/BackButton";
import Link from "next/link";
import { useSession } from "next-auth/react";


export default function LamaranDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lamaranId = params?.id;
  const { data: session } = useSession();

  const isManager =
    session?.user?.role === "manager" || session?.user?.role === "admin";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // State untuk form edit
  const [answers, setAnswers] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // State untuk Modal Keputusan
  const [modalOpen, setModalOpen] = useState(false);
  const [decision, setDecision] = useState<"ACCEPT" | "REJECT" | null>(null);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLamaran();
  }, [lamaranId]);

  const fetchLamaran = async () => {
    try {
      const res = await fetch(`/api/lamaran/${lamaranId}`);
      if (!res.ok) throw new Error("Gagal mengambil data lamaran");
      const json = await res.json();
      setData(json.data);
      setAnswers(json.data.answers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/lamaran/${lamaranId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CLAIM" }),
      });
      if (res.ok) {
        fetchLamaran();
      } else {
        alert("Gagal melakukan klaim.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAnswers = async () => {
    try {
      setIsSaving(true);
      const res = await fetch(`/api/lamaran/${lamaranId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "EDIT_ANSWERS", payload: { answers } }),
      });
      if (res.ok) {
        alert("Perubahan jawaban berhasil disimpan.");
        fetchLamaran();
      } else {
        alert("Gagal menyimpan perubahan.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const submitDecision = async () => {
    if (!reason.trim()) {
      alert("Alasan wajib diisi.");
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/lamaran/${lamaranId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: decision, payload: { reason } }),
      });
      if (res.ok) {
        setModalOpen(false);
        fetchLamaran();
      } else {
        alert("Gagal menyimpan keputusan.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDecisionModal = (type: "ACCEPT" | "REJECT") => {
    setDecision(type);
    setReason("");
    setModalOpen(true);
  };

  if (loading) return <div className="p-8 text-center">Memuat data...</div>;
  if (!data)
    return (
      <div className="p-8 text-center text-red-500">Data tidak ditemukan</div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <BackButton
          variant="ghost"
          size="icon"
          iconOnly
          fallbackUrl={
            isManager ? "/dashboard/manager" : "/dashboard/riwayat-lamaran"
          }
        />
        <h1 className="text-2xl font-bold tracking-tight">
          Detail Lamaran: {data.applicant.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kolom Info Kiri */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status Lamaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-xs">
                  Status Saat Ini
                </Label>
                <div
                  className={`mt-1 font-bold ${
                    data.status === "Pending"
                      ? "text-amber-500"
                      : data.status === "Reviewed"
                        ? "text-blue-500"
                        : data.status === "Accepted"
                          ? "text-emerald-500"
                          : "text-red-500"
                  }`}
                >
                  {data.status.toUpperCase()}
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground text-xs">
                  Posisi Dilamar
                </Label>
                <p className="mt-1 font-medium">{data.lowonganTitle}</p>
              </div>

              <div>
                <Label className="text-muted-foreground text-xs">Pelamar</Label>
                <div className="mt-1 flex items-center gap-2">
                  <a
                    href={`discord://-/users/${data.applicant.discordId}`}
                    className="font-medium text-sm text-primary hover:underline"
                    title="Klik untuk melihat profil Discord"
                  >
                    {data.applicant.name}
                  </a>
                  {isManager && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary"
                      asChild
                    >
                      <Link
                        href={`/dashboard/manager/audit/${data.applicant.discordId}`}
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        Audit
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              {data.discordChannelId &&
                data.status !== "Accepted" &&
                data.status !== "Rejected" && (
                  <div>
                    <Label className="text-muted-foreground text-xs">
                      Channel Interview
                    </Label>
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-primary border-primary/20 bg-primary/5 hover:bg-primary/10"
                        asChild
                      >
                        <a
                          href={`https://discord.com/channels/${data.discordGuildId}/${data.discordChannelId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessagesSquare className="mr-2 size-4" />
                          Buka di Discord
                        </a>
                      </Button>
                    </div>
                  </div>
                )}

              {data.claimedBy && (
                <div className="pt-4 border-t border-border mt-4">
                  <Label className="text-muted-foreground text-xs">
                    Ditangani Oleh
                  </Label>
                  <p className="mt-1 font-medium text-sm">
                    {data.claimedBy.name}
                  </p>
                </div>
              )}

              {data.reason && (
                <div className="pt-4 border-t border-border mt-4">
                  <Label className="text-muted-foreground text-xs">
                    Alasan Keputusan
                  </Label>
                  <p className="mt-1 text-sm italic">"{data.reason}"</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Panel - Hanya untuk Manager */}
          {isManager &&
            data.status !== "Accepted" &&
            data.status !== "Rejected" && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-primary">
                    Aksi Peninjauan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.status === "Pending" && (
                    <Button
                      className="w-full"
                      onClick={handleClaim}
                      disabled={isSubmitting}
                    >
                      <HandHeart className="mr-2 size-4" />
                      Klaim Lamaran
                    </Button>
                  )}
                  {data.status === "Reviewed" && (
                    <>
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => openDecisionModal("ACCEPT")}
                      >
                        <CheckCircle className="mr-2 size-4" />
                        Terima (Luluskan)
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => openDecisionModal("REJECT")}
                      >
                        <XCircle className="mr-2 size-4" />
                        Tolak
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
        </div>

        {/* Kolom Form Kanan */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Dokumen Formulir</CardTitle>
              <CardDescription>
                Anda dapat mengubah data isian di bawah ini jika terdapat
                penyesuaian yang disepakati dengan pelamar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {answers.map((ans, idx) => (
                <div key={ans.fieldId} className="space-y-2">
                  <Label className="font-semibold text-foreground/80">
                    {ans.question}
                  </Label>
                  {typeof ans.answer === "object" ? (
                    <Textarea
                      value={ans.answer.join(", ")}
                      onChange={(e) => {
                        const newAnswers = [...answers];
                        newAnswers[idx].answer = e.target.value
                          .split(",")
                          .map((s) => s.trim());
                        setAnswers(newAnswers);
                      }}
                      disabled={
                        !isManager ||
                        data.status === "Accepted" ||
                        data.status === "Rejected"
                      }
                      className="bg-muted/30 focus-visible:bg-background"
                    />
                  ) : (
                    <Input
                      value={ans.answer}
                      onChange={(e) => {
                        const newAnswers = [...answers];
                        newAnswers[idx].answer = e.target.value;
                        setAnswers(newAnswers);
                      }}
                      disabled={
                        !isManager ||
                        data.status === "Accepted" ||
                        data.status === "Rejected"
                      }
                      className="bg-muted/30 focus-visible:bg-background"
                    />
                  )}
                </div>
              ))}

              {isManager &&
                data.status !== "Accepted" &&
                data.status !== "Rejected" && (
                  <div className="pt-4 border-t border-border flex justify-end">
                    <Button onClick={handleSaveAnswers} disabled={isSaving}>
                      <Save className="mr-2 size-4" />
                      {isSaving ? "Menyimpan..." : "Simpan Perubahan Data"}
                    </Button>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Keputusan */}
      {modalOpen && decision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in-up">
            <h3 className="text-xl font-bold mb-2">
              {decision === "ACCEPT" ? "Terima Pelamar" : "Tolak Pelamar"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Mohon berikan alasan atas keputusan ini. Alasan ini akan tercatat
              dalam riwayat rekrutmen.
            </p>

            <div className="space-y-4 mb-6">
              <Label>
                Alasan {decision === "ACCEPT" ? "Penerimaan" : "Penolakan"}
              </Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ketik alasan di sini..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Batal
              </Button>
              <Button
                variant={decision === "ACCEPT" ? "default" : "destructive"}
                onClick={submitDecision}
                disabled={isSubmitting}
              >
                Konfirmasi
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
