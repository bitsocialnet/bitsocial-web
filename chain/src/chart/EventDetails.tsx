import type { Ref } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ChartEvent } from "@/lib/chart/events";
import { ExternalLink, TelegramLinks, TxLinks } from "@/rich-list/primitives";
import { useChartFormatters } from "./format";

/**
 * What happened on an event's day, opened from its dot. PriceChart places it beside the dot; it is
 * a non-modal dialog, so the chart stays usable while it is open.
 */
export default function EventDetails({
  ref,
  event,
  onClose,
}: {
  ref: Ref<HTMLDialogElement>;
  event: ChartEvent;
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation();
  const format = useChartFormatters();
  const titleId = `ch-details-${event.id}`;

  return (
    // The chart around it is left to right; the text follows the page.
    <dialog
      ref={ref}
      open
      className="ch-details"
      aria-labelledby={titleId}
      tabIndex={-1}
      dir={i18n.dir()}
    >
      <div className="ch-details-head">
        <time
          className="ch-details-date"
          dateTime={new Date(event.time * 1000).toISOString().slice(0, 10)}
        >
          {format.day(event.time)}
        </time>
        <button
          type="button"
          className="ch-details-close"
          aria-label={t("chart.eventDetails.close")}
          onClick={onClose}
        >
          <X aria-hidden size={16} strokeWidth={2} />
        </button>
      </div>
      <h3 id={titleId} className="ch-details-title">
        {t(`${event.copyKey}.title`)}
      </h3>
      <p className="ch-details-body">{t(`${event.copyKey}.body`)}</p>
      {event.links || event.txs || event.messageIds ? (
        <div className="ch-details-sources">
          {event.links?.map((link) => (
            <ExternalLink key={link.href} href={link.href} className="rl-link ch-details-link">
              {t(link.labelKey)}
              <ArrowUpRight aria-hidden size={12} strokeWidth={2} />
            </ExternalLink>
          ))}
          {event.txs ? <TxLinks txs={event.txs} /> : null}
          {event.messageIds ? <TelegramLinks messageIds={event.messageIds} /> : null}
        </div>
      ) : null}
    </dialog>
  );
}

/** The chart's events as text, for screen readers, which cannot reach the dots. */
export function EventList({ events }: { events: ChartEvent[] }) {
  const { t } = useTranslation();
  const format = useChartFormatters();

  return (
    <ol className="sr-only" aria-label={t("chart.eventList")}>
      {events.map((event) => (
        <li key={event.id}>
          {format.day(event.time)}: {t(`${event.copyKey}.title`)}. {t(`${event.copyKey}.body`)}
        </li>
      ))}
    </ol>
  );
}
