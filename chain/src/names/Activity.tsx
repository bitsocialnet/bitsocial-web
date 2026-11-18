import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  etherscanUrl,
  readRecentRegistrations,
  REGISTRY,
  type Registration,
} from "@/lib/names/registry";
import { useLiveData } from "@/lib/use-live-data";
import { shortAddress, useNamesFormat } from "./format";
import OutboundLink from "./OutboundLink";

const SHOWN = 8;
const fetchRecent = (signal: AbortSignal) => readRecentRegistrations(SHOWN, signal);
const NONE: Registration[] = [];

// One transaction can register several names (the launch seeding does), so a row is the pair.
const rowKey = (item: Registration) => `${item.txHash}:${item.tokenId}`;

/** The newest registrations, including any the visitor just made that the feed hasn't shown yet. */
export default function Activity({ local, nowMs }: { local: Registration[]; nowMs: number }) {
  const { t } = useTranslation();
  if (!REGISTRY) {
    return (
      <ActivityCard live={false}>
        <p className="nm-activity-empty">{t("names.activity.notDeployed")}</p>
      </ActivityCard>
    );
  }
  return <ActivityFeed local={local} nowMs={nowMs} />;
}

function ActivityCard({ live, children }: { live: boolean; children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <aside className="nm-activity glass-card" aria-labelledby="nm-activity-title">
      <div className="nm-activity-head">
        <h2 id="nm-activity-title" className="nm-card-title">
          {t("names.activity.title")}
        </h2>
        {live && (
          <span className="nm-live">
            <span aria-hidden="true" className="nm-live-dot" />
            {t("names.activity.live")}
          </span>
        )}
      </div>
      {children}
    </aside>
  );
}

function ActivityFeed({ local, nowMs }: { local: Registration[]; nowMs: number }) {
  const { t } = useTranslation();
  const format = useNamesFormat();
  const { data, status, refreshFailed } = useLiveData(NONE, fetchRecent, "the .bso registry");
  // A visitor's own registration shows before the feed has indexed it, in time order with the
  // rest, so it moves down as newer names arrive and drops off like any other row.
  const fetched = new Set(data.map(rowKey));
  const rows = [...local.filter((item) => !fetched.has(rowKey(item))), ...data]
    .sort((a, b) => b.registeredAt - a.registeredAt)
    .slice(0, SHOWN);
  const browseUrl = REGISTRY ? etherscanUrl("token", REGISTRY.address) : null;
  const live = status === "live" && !refreshFailed;

  if (rows.length === 0) {
    return (
      <ActivityCard live={live}>
        <p className="nm-activity-empty">
          {refreshFailed
            ? t("names.activity.failed")
            : status === "loading"
              ? "…"
              : t("names.activity.empty")}
        </p>
      </ActivityCard>
    );
  }

  return (
    <ActivityCard live={live}>
      <ul className="nm-activity-list">
        {rows.map((item) => {
          const txUrl = etherscanUrl("tx", item.txHash);
          const title = t("names.activity.registered", { name: `${item.label}.bso` });
          return (
            <li key={rowKey(item)} className="nm-activity-row">
              <span aria-hidden="true" className="nm-activity-dot" />
              <span className="nm-activity-text">
                <span className="nm-activity-name">
                  {txUrl ? (
                    <a href={txUrl} target="_blank" rel="noreferrer">
                      {title}
                    </a>
                  ) : (
                    title
                  )}
                </span>
                <span className="nm-activity-detail">{shortAddress(item.owner)}</span>
              </span>
              <span className="nm-activity-when">{format.ago(item.registeredAt, nowMs)}</span>
            </li>
          );
        })}
      </ul>
      {browseUrl && (
        <OutboundLink href={browseUrl} className="nm-activity-browse">
          {t("names.activity.browse")}
        </OutboundLink>
      )}
    </ActivityCard>
  );
}
