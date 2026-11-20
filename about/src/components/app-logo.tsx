import type { ComponentType } from "react";
import {
  Bell,
  BookOpen,
  Bot,
  Blocks,
  Clipboard,
  Coins,
  Compass,
  Filter,
  Flag,
  GitBranch,
  Image as ImageIcon,
  ImageOff,
  Layers,
  Link2,
  ListOrdered,
  MessageSquare,
  Network,
  Radio,
  Search,
  Send,
  Share2,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Terminal,
  Ticket,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppIconKey } from "@/lib/apps-data";

const iconMap = {
  bell: Bell,
  "book-open": BookOpen,
  bot: Bot,
  blocks: Blocks,
  clipboard: Clipboard,
  coins: Coins,
  compass: Compass,
  filter: Filter,
  flag: Flag,
  "git-branch": GitBranch,
  image: ImageIcon,
  "image-off": ImageOff,
  layers: Layers,
  "link-2": Link2,
  "list-ordered": ListOrdered,
  "message-square": MessageSquare,
  network: Network,
  radio: Radio,
  search: Search,
  send: Send,
  "share-2": Share2,
  shield: Shield,
  "sliders-horizontal": SlidersHorizontal,
  sparkles: Sparkles,
  tag: Tag,
  terminal: Terminal,
  ticket: Ticket,
  "trending-up": TrendingUp,
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
  logoDarkSrc?: string;
  pixelated?: boolean;
  loading?: "eager" | "lazy";
  size?: keyof typeof sizeMap;
  className?: string;
}

export default function AppLogo({
  name,
  icon,
  logoSrc,
  logoDarkSrc,
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
        <>
          <img
            src={logoSrc}
            alt={`${name} logo`}
            loading={loading}
            className={cn(
              "object-contain",
              styles.image,
              pixelated && "image-rendering-pixelated",
              logoDarkSrc && "dark:hidden",
            )}
          />
          {logoDarkSrc && (
            <img
              src={logoDarkSrc}
              alt={`${name} logo`}
              loading={loading}
              className={cn(
                "hidden object-contain dark:block",
                styles.image,
                pixelated && "image-rendering-pixelated",
              )}
            />
          )}
        </>
      ) : (
        <Icon className={cn("text-foreground/80", styles.icon)} aria-hidden="true" />
      )}
    </div>
  );
}
