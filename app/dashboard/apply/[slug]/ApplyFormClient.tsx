"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, CheckCircle2 } from "lucide-react";

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options: string[];
}

interface ApplyFormClientProps {
  lowonganId: string;
  fields: FormField[];
}

export default function ApplyFormClient({ lowonganId, fields }: ApplyFormClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // State untuk menyimpan jawaban. key = fieldId, value = string | string[]
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const handleInputChange = (fieldId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckboxChange = (fieldId: string, option: string, checked: boolean) => {
    setAnswers((prev) => {
      const current = (prev[fieldId] as string[]) || [];
      if (checked) {
        return { ...prev, [fieldId]: [...current, option] };
      } else {
        return { ...prev, [fieldId]: current.filter((o) => o !== option) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validasi field required (jika browser bypass)
    for (const field of fields) {
      if (field.required) {
        const val = answers[field.id];
        if (!val || (Array.isArray(val) && val.length === 0)) {
          setError(`Pertanyaan "${field.label}" wajib diisi.`);
          setIsSubmitting(false);
          return;
        }
      }
    }

    // Format payload untuk disubmit
    const payloadAnswers = fields.map((field) => ({
      fieldId: field.id,
      question: field.label,
      answer: answers[field.id] || (field.type === "checkbox" ? [] : ""),
    }));

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lowonganId, answers: payloadAnswers }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim lamaran");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Lamaran Terkirim!</h2>
        <p className="text-muted-foreground mb-8">
          Terima kasih telah melamar. Lamaran Anda akan segera ditinjau oleh tim kami. Anda bisa memantau status lamaran di Dashboard Anda.
        </p>
        <Button onClick={() => router.push("/dashboard")}>
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded-md text-sm font-medium border border-red-200">
          Error: {error}
        </div>
      )}

      {fields.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          Formulir ini tidak memerlukan isian kustom. Silakan langsung klik tombol kirim di bawah.
        </div>
      ) : (
        <div className="space-y-6">
          {fields.map((field, idx) => (
            <div key={field.id} className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4 transition-all focus-within:border-primary/50">
              <Label className="text-base font-medium flex gap-1">
                {idx + 1}. {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </Label>
              
              <div className="pt-2">
                {field.type === "text" && (
                  <Input 
                    required={field.required}
                    value={(answers[field.id] as string) || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder="Ketik jawaban Anda..."
                    className="max-w-xl bg-background"
                  />
                )}

                {field.type === "textarea" && (
                  <Textarea 
                    required={field.required}
                    value={(answers[field.id] as string) || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder="Ketik jawaban lengkap Anda..."
                    rows={4}
                    className="bg-background"
                  />
                )}

                {field.type === "select" && (
                  <select
                    required={field.required}
                    value={(answers[field.id] as string) || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="flex h-10 w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="" disabled>-- Pilih Salah Satu --</option>
                    {field.options.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}

                {field.type === "radio" && (
                  <div className="space-y-3">
                    {field.options.map((opt, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id={`${field.id}-${i}`}
                          name={field.id}
                          value={opt}
                          required={field.required}
                          checked={answers[field.id] === opt}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor={`${field.id}-${i}`} className="font-normal cursor-pointer text-sm">
                          {opt}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}

                {field.type === "checkbox" && (
                  <div className="space-y-3">
                    {field.options.map((opt, i) => {
                      const isChecked = ((answers[field.id] as string[]) || []).includes(opt);
                      return (
                        <div key={i} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={`${field.id}-${i}`}
                            value={opt}
                            checked={isChecked}
                            onChange={(e) => handleCheckboxChange(field.id, opt, e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor={`${field.id}-${i}`} className="font-normal cursor-pointer text-sm">
                            {opt}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end pt-6 pb-12">
        <Button 
          type="submit" 
          size="lg" 
          disabled={isSubmitting} 
          className="w-full sm:w-auto h-12 px-8 text-md shadow-lg shadow-primary/20"
        >
          {isSubmitting ? (
            <><Loader2 className="mr-2 size-5 animate-spin" /> Mengirim...</>
          ) : (
            <><Send className="mr-2 size-5" /> Kirim Lamaran</>
          )}
        </Button>
      </div>
    </form>
  );
}
