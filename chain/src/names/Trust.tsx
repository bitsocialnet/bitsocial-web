import { useTranslation } from "react-i18next";
import { etherscanUrl, readFeeSafe, REGISTRY } from "@/lib/names/registry";
import { BSO_FEE_SAFE_URL, BSO_REGISTRY_BSIP_URL } from "@/lib/site";
import { useLiveData } from "@/lib/use-live-data";

const fetchSafe = () => readFeeSafe();
const UNKNOWN = null as { threshold: number; owners: number } | null;

export default function Trust() {
  const { t } = useTranslation();
  // The Safe can gain signers without changing address, so its threshold is read, not written down.
  const { data: safe } = useLiveData(UNKNOWN, fetchSafe, "the fee Safe");
  const contractUrl = REGISTRY ? etherscanUrl("address", REGISTRY.address) : null;

  const items = [
    ["noAdmin", t("names.trust.noAdminNote")],
    ["prices", t("names.trust.pricesNote")],
    ["fees", safe ? t("names.trust.feesNote", safe) : t("names.trust.feesNoteUnknown")],
    ["moves", t("names.trust.movesNote")],
  ] as const;

  return (
    <section className="nm-trust glass-card" aria-labelledby="nm-trust-title">
      <h2 id="nm-trust-title" className="nm-card-title">
        {t("names.trust.title")}
      </h2>
      <ul className="nm-trust-list">
        {items.map(([key, note]) => (
          <li key={key}>
            <span className="nm-trust-lead">{t(`names.trust.${key}`)}</span> {note}
          </li>
        ))}
      </ul>
      <p className="nm-trust-links">
        {contractUrl && (
          <a className="rl-link" href={contractUrl} target="_blank" rel="noreferrer">
            {t("names.trust.contract")}
          </a>
        )}
        <a className="rl-link" href={BSO_FEE_SAFE_URL} target="_blank" rel="noreferrer">
          {t("names.trust.safe")}
        </a>
        <a className="rl-link" href={BSO_REGISTRY_BSIP_URL} target="_blank" rel="noreferrer">
          {t("names.trust.spec")}
        </a>
      </p>
    </section>
  );
}
