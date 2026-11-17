import { useTranslation } from "react-i18next";
import {
  etherscanUrl,
  readRecentRegistrations,
  REGISTRY,
  type Registration,
} from "@/lib/names/registry";
import { useLiveData } from "@/lib/use-live-data";
import { shortAddress, useNamesFormat } from "./format";

const SHOWN = 8;
const fetchRecent = () => readRecentRegistrations(SHOWN);
const NONE: Registration[] = [];

/** The newest registrations, with any the visitor just made on top. */
export default function Activity({ local, nowMs }: { local: Registration[]; nowMs: number }) {
  const { t } = useTranslation();

  return (
    <aside className="nm-activity glass-card" aria-labelledby="nm-activity-title">
      <div className="nm-activity-head">
        <h2 id="nm-activity-title" className="nm-card-title">
          {t("names.activity.title")}
        </h2>
        {REGISTRY && (
          <span className="nm-live">
            <span aria-hidden="true" className="nm-live-dot" />
            {t("names.activity.live")}
          </span>
        )}
      </div>
      {REGISTRY ? (
        <ActivityList local={local} nowMs={nowMs} />
      ) : (
        <p className="nm-activity-empty">{t("names.activity.notDeployed")}</p>
      )}
    </aside>
  );
}

function ActivityList({ local, nowMs }: { local: Registration[]; nowMs: number }) {
  const { t } = useTranslation();
  const format = useNamesFormat();
  const { data, status } = useLiveData(NONE, fetchRecent, "the .bso registry");
  const seen = new Set(local.map((item) => item.txHash));
  const rows = [...local, ...data.filter((item) => !seen.has(item.txHash))].slice(0, SHOWN);
  const browseUrl = REGISTRY ? etherscanUrl("token", REGISTRY.address) : null;

  if (rows.length === 0) {
    return (
      <p className="nm-activity-empty">
        {status === "unavailable"
          ? t("names.activity.failed")
          : status === "loading"
            ? "…"
            : t("names.activity.empty")}
      </p>
    );
  }

  return (
    <>
      <ul className="nm-activity-list">
        {rows.map((item) => {
          const txUrl = etherscanUrl("tx", item.txHash);
          const title = t("names.activity.registered", { name: `${item.label}.bso` });
          return (
            <li key={item.txHash} className="nm-activity-row">
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
        <a className="rl-link nm-activity-browse" href={browseUrl} target="_blank" rel="noreferrer">
          {t("names.activity.browse")}
        </a>
      )}
    </>
  );
}
