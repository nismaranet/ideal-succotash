import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export const metadata = {
  title: {
    default: "Dashboard",
    template: "%s - Nismara Recruitment",
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Sidebar role={session.user.role} />

      <div className="lg:pl-64">
        <Header user={session.user} />

        <main className="py-6 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {!session.user.isGuildMember ? (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
                <div className="mx-auto w-16 h-16 bg-red-100/50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="size-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-red-500 mb-2">Akses Terbatas</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Anda belum terdeteksi berada di server Discord Nismara. Silakan bergabung terlebih dahulu untuk mengakses dashboard pendaftaran.
                </p>
                <div className="flex flex-col gap-3">
                  <a 
                    href="https://link.nismara.web.id/discord" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 mx-auto mb-2"
                  >
                    Bergabung ke Discord
                  </a>
                  <p className="text-sm text-muted-foreground">Setelah bergabung, silakan login ulang atau tunggu beberapa saat agar sistem mensinkronisasi data Anda.</p>
                </div>
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
