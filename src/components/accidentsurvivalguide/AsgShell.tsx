import { Source_Serif_4 } from "next/font/google";
import { cn } from "@/lib/utils";

const asgSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-asg-serif",
  display: "swap",
});

export function AsgShell({
  children,
  className,
  lang,
}: {
  children: React.ReactNode;
  className?: string;
  lang?: string;
}) {
  return (
    <div
      lang={lang}
      className={cn(
        asgSerif.variable,
        "asg-page-texture min-h-screen font-sans text-asg-navy antialiased",
        className,
      )}
    >
      {children}
    </div>
  );
}
