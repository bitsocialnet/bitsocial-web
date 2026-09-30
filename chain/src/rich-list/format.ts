import { useMemo } from "react";
import { useTranslation } from "react-i18next";

/** Number, currency and date formatters for the active language. */
export function useFormatters() {
  const { i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language ?? "en";

  return useMemo(() => {
    const integer = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
    const compact = new Intl.NumberFormat(locale, {
      notation: "compact",
      maximumFractionDigits: 1,
    });
    const percent = new Intl.NumberFormat(locale, {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const wholePercent = new Intl.NumberFormat(locale, {
      style: "percent",
      maximumFractionDigits: 1,
    });
    const usd = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
    const smallUsd = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const price = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 5,
      maximumFractionDigits: 5,
    });
    const day = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" });
    const month = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" });
    const relative = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    const year = new Intl.DateTimeFormat(locale, { year: "numeric", timeZone: "UTC" });

    return {
      integer: (value: number) => integer.format(value),
      compact: (value: number) => compact.format(value),
      percent: (value: number) => percent.format(value),
      wholePercent: (value: number) => wholePercent.format(value),
      usd: (value: number | null) =>
        value === null ? "—" : value < 100 ? smallUsd.format(value) : usd.format(value),
      price: (value: number | null) => (value === null ? "—" : price.format(value)),
      day: (iso: string) => day.format(new Date(iso)),
      month: (iso: string) => month.format(new Date(iso)),
      /** "now", "3 minutes ago", "2 hours ago", "5 days ago" */
      ago: (iso: string, now: number) => {
        const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
        if (seconds > -60) {
          return relative.format(0, "second");
        }
        if (seconds > -3600) {
          return relative.format(Math.round(seconds / 60), "minute");
        }
        if (seconds > -86400) {
          return relative.format(Math.round(seconds / 3600), "hour");
        }
        return relative.format(Math.round(seconds / 86400), "day");
      },
      year: (iso: string) => year.format(new Date(iso)),
    };
  }, [locale]);
}
