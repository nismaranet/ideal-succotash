import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Lowongan baru",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
