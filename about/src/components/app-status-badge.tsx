import { useTranslation } from "react-i18next";
import type { AppData } from "@/lib/apps-data";
import { cn } from "@/lib/utils";

export default function AppStatusBadge({ status }: { status: NonNullable<AppData["status"]> }) {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[0.625rem] font-medium uppercase leading-4 tracking-[0.14em]",
        status === "ready"
          ? "border-emerald-500/30 text-emerald-700 dark:border-emerald-400/35 dark:text-emerald-200"
          : "border-amber-500/25 text-amber-700 dark:border-amber-400/35 dark:text-amber-200",
      )}
    >
      {status === "ready" ? t("apps.readyToUse") : t("apps.experimental")}
    </span>
  );
}
