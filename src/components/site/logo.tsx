import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
}

export function LogoMark({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sage-mark-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A7F3D0" />
          <stop offset="0.5" stopColor="#34D399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="oklch(0.16 0.012 260)" stroke="oklch(0.78 0.17 162 / 0.3)" strokeWidth="1" />
      <path
        d="M44 20c-2.5 0-4.5 1.5-5.5 3.5C37 21 34 19 30.5 19c-5 0-9 4-9 9 0 9 13 14 16.5 18.5C40.5 43 51 36 51 27c0-3.9-3.1-7-7-7z"
        fill="url(#sage-mark-grad)"
      />
      <path
        d="M22 44c1.5-3 4.5-5 8-5"
        stroke="url(#sage-mark-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="18" cy="20" r="2" fill="url(#sage-mark-grad)" opacity="0.6" />
    </svg>
  );
}

export function Logo({ className, showWordmark = true, size = "md" }: LogoProps) {
  const markSize = size === "sm" ? 28 : size === "lg" ? 44 : 36;
  const textCls = size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark size={markSize} />
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className={cn("font-display font-bold tracking-tight text-foreground", textCls)}>
            Sage
          </span>
          <span className="text-[10px] font-medium text-emerald-400/80 tracking-wide uppercase">
            by VirtuaLab Digital
          </span>
        </div>
      )}
    </div>
  );
}
