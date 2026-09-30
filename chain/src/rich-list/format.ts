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
      year: (iso: string) => year.format(new Date(iso)),
    };
  }, [locale]);
}
