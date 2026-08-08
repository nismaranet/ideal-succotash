"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Settings,
} from "lucide-react";


interface FormField {
  id: string;
  type: "text" | "textarea" | "radio" | "checkbox" | "select";
  label: string;
  required: boolean;
  options: string[];
}

export default function FormBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lowonganTitle, setLowonganTitle] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);

  useEffect(() => {
    fetch(`/api/lowongan/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data lowongan");
        return res.json();
      })
      .then((json) => {
        setLowonganTitle(json.title);
        if (json.formFields && Array.isArray(json.formFields)) {
          setFields(json.formFields);
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const addField = () => {
    setFields([
      ...fields,
      {
        id: Math.random().toString(36).substring(7),
        type: "text",
        label: "Pertanyaan Baru",
        required: true,
        options: [],
      },
    ]);
  };

  const removeField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const moveField = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index > 0) {
      const newFields = [...fields];
      const temp = newFields[index];
      newFields[index] = newFields[index - 1];
      newFields[index - 1] = temp;
      setFields(newFields);
    } else if (direction === "down" && index < fields.length - 1) {
      const newFields = [...fields];
      const temp = newFields[index];
      newFields[index] = newFields[index + 1];
      newFields[index + 1] = temp;
      setFields(newFields);
    }
  };

  const updateField = (index: number, key: keyof FormField, value: any) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFields(newFields);
  };

  const addOption = (fieldIndex: number) => {
    const newFields = [...fields];
    newFields[fieldIndex].options.push(
      `Opsi ${newFields[fieldIndex].options.length + 1}`,
    );
    setFields(newFields);
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const newFields = [...fields];
    newFields[fieldIndex].options.splice(optionIndex, 1);
    setFields(newFields);
  };

  const updateOption = (
    fieldIndex: number,
    optionIndex: number,
    value: string,
  ) => {
    const newFields = [...fields];
    newFields[fieldIndex].options[optionIndex] = value;
    setFields(newFields);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    // Validasi basic
    for (const field of fields) {
      if (!field.label.trim()) {
        setError("Ada pertanyaan yang belum diisi teksnya.");
        setIsSaving(false);
        return;
      }
      if (
        ["select", "radio", "checkbox"].includes(field.type) &&
        field.options.length === 0
      ) {
        setError(
          `Pertanyaan "${field.label}" bertipe pilihan tapi tidak memiliki opsi.`,
        );
        setIsSaving(false);
        return;
      }
    }

    try {
      const res = await fetch(`/api/lowongan/${id}/form`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formFields: fields }),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Gagal menyimpan formulir");
      }

      router.push("/dashboard/manager/lowongan");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Rakit Formulir</h1>
        <p className="text-muted-foreground">
          Rancang pertanyaan khusus untuk pelamar di lowongan:{" "}
          <strong className="text-foreground">{lowonganTitle}</strong>
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded-md text-sm font-medium border border-red-200">
          Error: {error}
        </div>
      )}

      <div className="space-y-6">
        {fields.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed border-border rounded-xl text-muted-foreground bg-muted/20">
            Belum ada pertanyaan kustom. Pelamar hanya akan mengisi data profil
            bawaan (Nama, Email, dll).
            <br />
            Klik tombol di bawah untuk mulai merakit formulir.
          </div>
        ) : (
          fields.map((field, idx) => (
            <div
              key={field.id}
              className="relative rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6 group transition-all hover:border-primary/50"
            >
              {/* Toolbar Atas Kanan */}
              <div className="absolute top-4 right-4 flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => moveField(idx, "up")}
                  disabled={idx === 0}
                  title="Naikkan"
                >
                  <ArrowUp className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => moveField(idx, "down")}
                  disabled={idx === fields.length - 1}
                  title="Turunkan"
                >
                  <ArrowDown className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeField(idx)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  title="Hapus"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                {/* Kolom Kiri: Pertanyaan */}
                <div className="md:col-span-8 space-y-4">
                  <div className="space-y-2">
                    <Label>Pertanyaan {idx + 1}</Label>
                    <Input
                      value={field.label}
                      onChange={(e) =>
                        updateField(idx, "label", e.target.value)
                      }
                      placeholder="Masukkan pertanyaan di sini..."
                      className="font-medium text-lg h-12"
                    />
                  </div>

                  {/* Pengaturan Opsi (Jika tipe pilihan) */}
                  {["select", "radio", "checkbox"].includes(field.type) && (
                    <div className="pl-4 border-l-2 border-border/50 space-y-3 mt-4">
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Settings className="size-3" /> Pilihan Jawaban
                      </Label>
                      {field.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <div className="size-4 rounded-full border border-border shrink-0 bg-muted/50 flex items-center justify-center text-[10px] text-muted-foreground">
                            {optIdx + 1}
                          </div>
                          <Input
                            value={opt}
                            onChange={(e) =>
                              updateOption(idx, optIdx, e.target.value)
                            }
                            className="h-9 text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeOption(idx, optIdx)}
                            className="text-red-400"
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addOption(idx)}
                        className="h-8 text-xs mt-2 text-muted-foreground"
                      >
                        <Plus className="size-3 mr-1" /> Tambah Pilihan
                      </Button>
                    </div>
                  )}
                </div>

                {/* Kolom Kanan: Pengaturan */}
                <div className="md:col-span-4 space-y-4 border-t md:border-t-0 md:border-l border-border md:pl-6 pt-4 md:pt-0">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Tipe Jawaban
                    </Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      value={field.type}
                      onChange={(e) => updateField(idx, "type", e.target.value)}
                    >
                      <option value="text">Teks Singkat</option>
                      <option value="textarea">Paragraf (Teks Panjang)</option>
                      <option value="radio">Pilihan Tunggal (Radio)</option>
                      <option value="select">Dropdown (Pilih Satu)</option>
                      <option value="checkbox">
                        Pilihan Ganda (Bisa pilih &gt; 1)
                      </option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id={`req-${field.id}`}
                      checked={field.required}
                      onChange={(e) =>
                        updateField(idx, "required", e.target.checked)
                      }
                      className="rounded border-gray-300 text-primary focus:ring-primary size-4"
                    />
                    <Label
                      htmlFor={`req-${field.id}`}
                      className="cursor-pointer"
                    >
                      Wajib Diisi
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        <div className="flex items-center gap-4">
          <Button
            onClick={addField}
            variant="secondary"
            className="border border-border shadow-sm"
          >
            <Plus className="mr-2 size-4" />
            Tambah Pertanyaan
          </Button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-border bg-background/80 backdrop-blur-sm shadow-[0_-4px_10px_-10px_rgba(0,0,0,0.1)] z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isSaving}
          >
            Batal
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="min-w-32 shadow-lg shadow-primary/20"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              "Simpan Formulir"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Komponen X (close) untuk hapus opsi biar gak perlu import lucide X lagi
function X(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
