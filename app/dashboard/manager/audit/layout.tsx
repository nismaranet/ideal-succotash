import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit User",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
