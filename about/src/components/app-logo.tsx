import type { ComponentType } from "react";
import {
  Blocks,
  Clipboard,
  Image as ImageIcon,
  MessageSquare,
  Shield,
  Terminal,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppIconKey } from "@/lib/apps-data";

const iconMap = {
  blocks: Blocks,
  clipboard: Clipboard,
  image: ImageIcon,
  "message-square": MessageSquare,
  shield: Shield,
  terminal: Terminal,
  ticket: Ticket,
} satisfies Record<AppIconKey, ComponentType<{ className?: string }>>;

const sizeMap = {
  sm: {
    frame: "h-12 w-12 rounded-2xl",
    image: "h-8 w-8",
    icon: "h-5 w-5",
  },
  md: {
    frame: "h-14 w-14 rounded-[1.15rem]",
    image: "h-10 w-10",
    icon: "h-6 w-6",
  },
  lg: {
    frame: "h-20 w-20 rounded-[1.5rem]",
    image: "h-14 w-14",
    icon: "h-8 w-8",
  },
} as const;

interface AppLogoProps {
  name: string;
  icon: AppIconKey;
  logoSrc?: string;
  pixelated?: boolean;
  loading?: "eager" | "lazy";
  size?: keyof typeof sizeMap;
  className?: string;
}

export default function AppLogo({
  name,
  icon,
  logoSrc,
  pixelated = false,
  loading = "lazy",
  size = "md",
  className,
}: AppLogoProps) {
  const Icon = iconMap[icon];
  const styles = sizeMap[size];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center border border-border/60 bg-white/80 shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:bg-foreground/5",
        styles.frame,
        className,
      )}
    >
      {logoSrc ? (
        <img
          src={logoSrc}
          alt={`${name} logo`}
          loading={loading}
          className={cn("object-contain", styles.image, pixelated && "image-rendering-pixelated")}
        />
      ) : (
        <Icon className={cn("text-foreground/80", styles.icon)} aria-hidden="true" />
      )}
    </div>
  );
}
