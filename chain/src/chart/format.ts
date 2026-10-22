import { useMemo } from "react";
import { useTranslation } from "react-i18next";

/**
 * Formatters for the chart. BSO has traded between $0.0001 and $0.08, so prices keep four
 * significant digits instead of a fixed number of decimals.
 */
export function useChartFormatters() {
  const { i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language ?? "en";

  return useMemo(() => {
    const price = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      minimumSignificantDigits: 2,
      maximumSignificantDigits: 4,
    });
    const change = new Intl.NumberFormat(locale, {
      style: "percent",
      signDisplay: "exceptZero",
      maximumFractionDigits: 1,
    });
    const volume = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    });
    const marketCap = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumSignificantDigits: 3,
    });
    const day = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" });
    const year = new Intl.DateTimeFormat(locale, { year: "numeric", timeZone: "UTC" });

    return {
      locale,
      price: (value: number) => price.format(value),
      change: (value: number) => change.format(value),
      volume: (value: number) => volume.format(value),
      marketCap: (value: number) => marketCap.format(value),
      /** Unix seconds to a UTC date. */
      day: (seconds: number) => day.format(seconds * 1000),
      year: (seconds: number) => year.format(seconds * 1000),
    };
  }, [locale]);
}

export type ChartFormatters = ReturnType<typeof useChartFormatters>;
