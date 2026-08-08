import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kelola Lowongan",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
