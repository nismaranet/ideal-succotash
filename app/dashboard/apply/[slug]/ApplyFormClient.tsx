"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

interface ConditionRule {
  fieldId: string;
  operator: "equals" | "not_equals" | "contains";
  value: string;
}

interface FormFieldCondition {
  logic: "AND" | "OR";
  rules: ConditionRule[];
}

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options: string[];
  condition?: FormFieldCondition;
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  
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

  const evaluateCondition = (condition?: FormFieldCondition): boolean => {
    if (!condition || !condition.rules || condition.rules.length === 0) return true;

    const results = condition.rules.map(rule => {
      const answer = answers[rule.fieldId];
      if (answer === undefined) return false;

      const ansStr = Array.isArray(answer) ? answer.join(",").toLowerCase() : answer.toLowerCase();
      const valStr = rule.value.toLowerCase();

      switch (rule.operator) {
        case "equals":
          return ansStr === valStr;
        case "not_equals":
          return ansStr !== valStr;
        case "contains":
          return ansStr.includes(valStr);
        default:
          return false;
      }
    });

    if (condition.logic === "OR") {
      return results.some(r => r === true);
    }
    
    // Default to AND
    return results.every(r => r === true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const visibleFields = fields.filter(f => evaluateCondition(f.condition));

    // Validasi field required (jika browser bypass)
    for (const field of visibleFields) {
      if (field.required) {
        const val = answers[field.id];
        if (!val || (Array.isArray(val) && val.length === 0)) {
          setError(`Pertanyaan "${field.label}" wajib diisi.`);
          return;
        }
      }
    }

    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (!turnstileToken) {
      setError("Harap selesaikan verifikasi keamanan (Turnstile) terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const visibleFields = fields.filter(f => evaluateCondition(f.condition));
    const payloadAnswers = visibleFields.map((field) => ({
      fieldId: field.id,
      question: field.label,
      answer: answers[field.id] || (field.type === "checkbox" ? [] : ""),
    }));

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          lowonganId, 
          answers: payloadAnswers,
          turnstileToken
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim lamaran");
      }

      setShowConfirmModal(false);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
      setShowConfirmModal(false);
      setTurnstileToken(null);
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
    <>
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
          {fields.filter(f => evaluateCondition(f.condition)).map((field, idx) => (
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
          <Send className="mr-2 size-5" /> Kirim Lamaran
        </Button>
      </div>
    </form>

    {showConfirmModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <div className="w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl overflow-hidden animate-fade-in-up">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">Konfirmasi Pengiriman</h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Apakah Anda yakin data yang Anda isi sudah benar? Lamaran tidak dapat diubah setelah dikirim.
            </p>
            
            <div className="flex justify-center mb-6">
              <Turnstile 
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                onSuccess={(token) => setTurnstileToken(token)}
                onError={() => setError("Verifikasi gagal. Silakan coba lagi.")}
                onExpire={() => setTurnstileToken(null)}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowConfirmModal(false);
                  setTurnstileToken(null);
                }}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button 
                onClick={handleConfirmSubmit} 
                disabled={!turnstileToken || isSubmitting}
                className="min-w-28 shadow-lg shadow-primary/20"
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 size-4 animate-spin" /> Proses...</>
                ) : (
                  "Ya, Kirim"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
