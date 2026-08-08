import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Tanya Jawab (FAQ)",
  description:
    "Temukan jawaban atas pertanyaan-pertanyaan yang sering diajukan seputar proses pendaftaran, operasional, dan komunitas Nismara.",
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
