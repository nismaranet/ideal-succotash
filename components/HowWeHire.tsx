import { ReactNode } from "react";
import { FileText, Phone, Users, ShieldCheck } from "lucide-react";
import { DiscordIcon } from "@/components/icons/SocialMedia";

export interface HireStep {
  id: number;
  title: string;
  description: string;
  icon: ReactNode;
}

const defaultSteps: HireStep[] = [
  {
    id: 1,
    title: "Gabung Discord Nismara",
    description:
      "Gabung terlebih dahulu server Discord Nismara karena kami hanya menerima lamaran dari member server Discord Nismara",
    icon: <DiscordIcon className="size-8" />,
  },
  {
    id: 2,
    title: "Mengisi Formulir",
    description:
      "Apabila kamu sudah bergabung dengan server Discord Nismara, selanjutnya kamu dapat mengisi formulir lamaran yang tersedia",
    icon: <FileText className="size-8" />,
  },
  {
    id: 3,
    title: "Interview",
    description:
      "Kamu akan mengikuti sesi wawancara untuk memastikan data yang kamu berikan akurat dan sesuai dengan lowongan yang kamu lamar.",
    icon: <ShieldCheck className="size-8" />,
  },
];

interface HowWeHireProps {
  title?: string;
  subtitle?: string;
  steps?: HireStep[];
  className?: string;
}

export default function HowWeHire({
  title = "Bagaimana Prosesnya?",
  subtitle = "Proses rekrutmen kami dirancang agar transparan, cepat, dan bersahabat.",
  steps = defaultSteps,
  className = "py-20 lg:py-28 bg-background",
}: HowWeHireProps) {
  return (
    <section className={className}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className="group relative flex flex-col rounded-3xl border border-border bg-card p-8 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 animate-fade-in-up overflow-hidden"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Subtle background glow on hover */}
              <div className="absolute -right-20 -top-20 size-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="flex items-start justify-between mb-10">
                <div className="bg-primary/10 p-4 rounded-2xl ring-1 ring-primary/20 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  {/* The icon inherits text color, so we use current color trick or specific styling */}
                  <div className="text-primary group-hover:text-primary-foreground transition-colors">
                    {step.icon}
                  </div>
                </div>
                <div className="bg-muted text-muted-foreground text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider group-hover:bg-foreground group-hover:text-background transition-colors">
                  Step {step.id}
                </div>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                {step.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed flex-1">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div
          className="mt-16 text-center animate-fade-in-up"
          style={{ animationDelay: "500ms" }}
        >
          <p className="text-muted-foreground mb-4">
            Belum bergabung dengan server kami?
          </p>
          <a
            href="https://link.nismara.web.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8 bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-300"
          >
            <DiscordIcon className="mr-2 size-5" />
            Gabung Discord Nismara Sekarang
          </a>
        </div>
      </div>
    </section>
  );
}
