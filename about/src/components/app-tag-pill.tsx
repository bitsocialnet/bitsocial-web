import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AppTagPillProps {
  active?: boolean;
  href?: string;
  label: string;
  onClick?: () => void;
}

const baseClassName =
  "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium transition-all duration-300";

export default function AppTagPill({ active = false, href, label, onClick }: AppTagPillProps) {
  const className = cn(
    baseClassName,
    active
      ? "border-blue-core/30 text-foreground ring-glow dark:border-blue-core/55"
      : "border-border/60 bg-transparent text-muted-foreground hover:border-blue-glow hover:text-foreground",
  );

  if (href) {
    return (
      <Link to={href} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
}
