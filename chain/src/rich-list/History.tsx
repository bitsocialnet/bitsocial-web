import { useTranslation } from "react-i18next";
import { HISTORY } from "@/lib/rich-list/data";
import { useFormatters } from "./format";
import { ExternalLink, RichSection, TelegramLinks, TxLinks } from "./primitives";

export default function History() {
  const { t } = useTranslation();
  const format = useFormatters();

  return (
    <RichSection id="history" title={t("richList.history.title")} lead={t("richList.history.lead")}>
      <div className="rl-panel glass-card">
        <ol className="rl-timeline">
          {HISTORY.map((event) => (
            <li key={event.id} className="rl-timeline-item">
              <time className="rl-timeline-date" dateTime={event.date}>
                {event.precision === "year"
                  ? format.year(event.date)
                  : event.precision === "month"
                    ? format.month(event.date)
                    : format.day(event.date)}
              </time>
              <div className="rl-timeline-body">
                <h3 className="rl-timeline-title">
                  {t(`richList.history.events.${event.id}.title`)}
                </h3>
                <p>{t(`richList.history.events.${event.id}.body`)}</p>
                {event.link ? (
                  <p>
                    <ExternalLink href={event.link}>
                      {t("richList.history.redditThread")}
                    </ExternalLink>
                  </p>
                ) : null}
                {event.txs || event.messageIds ? (
                  <div className="rl-timeline-sources">
                    {event.txs ? <TxLinks txs={event.txs} /> : null}
                    {event.messageIds ? <TelegramLinks messageIds={event.messageIds} /> : null}
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </RichSection>
  );
}
