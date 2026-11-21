import { type ReactNode, useMemo } from "react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { formatEther } from "viem";
import type { Spelling } from "@/lib/names/spelling";
import { useNow } from "@/lib/use-now";

/** Formatters for the names page, in the active language, built once per language. */
export function useNamesFormat() {
  const { i18n } = useTranslation();
  const language = i18n.language;

  return useMemo(() => {
    const small = new Intl.NumberFormat(language, { maximumFractionDigits: 6 });
    const large = new Intl.NumberFormat(language, { maximumFractionDigits: 2 });
    const day = new Intl.DateTimeFormat(language, { dateStyle: "medium" });
    const moment = new Intl.DateTimeFormat(language, { dateStyle: "medium", timeStyle: "short" });
    const relative = new Intl.RelativeTimeFormat(language, { numeric: "auto" });

    return {
      eth: (wei: bigint) => {
        const value = Number(formatEther(wei));
        return `${(value >= 1 ? large : small).format(value)} ETH`;
      },
      date: (seconds: number) => day.format(seconds * 1000),
      dateTime: (seconds: number) => moment.format(seconds * 1000),
      ago: (seconds: number, nowMs: number) => {
        const diff = seconds - nowMs / 1000;
        const abs = Math.abs(diff);
        if (abs < 60) return relative.format(Math.round(diff), "second");
        if (abs < 3600) return relative.format(Math.round(diff / 60), "minute");
        if (abs < 86_400) return relative.format(Math.round(diff / 3600), "hour");
        return relative.format(Math.round(diff / 86_400), "day");
      },
    };
  }, [language]);
}

/** Re-renders only its own children every second, for countdowns. */
export function Ticking({ children }: { children: (nowSeconds: number) => ReactNode }) {
  const nowMs = useNow(1000);
  return children(nowMs / 1000);
}

export const shortAddress = (address: string) => `${address.slice(0, 6)}…${address.slice(-4)}`;

export const shortKey = (key: string) => `${key.slice(0, 12)}…${key.slice(-6)}`;

/** "41:12", or "2:05:09" past an hour. */
export function countdown(seconds: number) {
  const total = Math.max(0, Math.ceil(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = String(total % 60).padStart(2, "0");
  return hours > 0 ? `${hours}:${String(minutes).padStart(2, "0")}:${secs}` : `${minutes}:${secs}`;
}

/** Why a spelling was refused, in the visitor's language. */
export function spellingProblemText(t: TFunction, spelling: Extract<Spelling, { ok: false }>) {
  if (spelling.problem !== "character") return t(`names.checks.${spelling.problem}`);
  return spelling.character
    ? t("names.checks.character", { character: spelling.character })
    : t("names.checks.characterUnknown");
}
