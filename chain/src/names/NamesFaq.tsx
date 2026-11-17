import { useTranslation } from "react-i18next";
import { etherscanUrl, feeForLength, readFeeSafe, REGISTRY } from "@/lib/names/registry";
import { BSO_FEE_SAFE_URL, BSO_REGISTRY_BSIP_URL } from "@/lib/site";
import { useLiveData } from "@/lib/use-live-data";
import { useNamesFormat } from "./format";

const GROUPS = [
  {
    key: "using",
    items: ["what", "profiles", "cost", "claiming", "expiry", "spelling", "transfer", "subnames"],
  },
  { key: "launch", items: ["launch", "eth"] },
  { key: "trust", items: ["control", "fees", "whyRegistry", "whyEth", "move", "afterMove"] },
] as const;

const PRICE_LENGTHS = [1, 2, 3, 4, 5] as const;

const fetchSafe = () => readFeeSafe();
const UNKNOWN = null as { threshold: number; owners: number } | null;

/** The questions BSIP-13 answers, in the page's words, with the registry's own numbers. */
export default function NamesFaq() {
  const { t } = useTranslation();
  const format = useNamesFormat();
  // The Safe can gain signers without changing address, so its threshold is read, not written down.
  const { data: safe } = useLiveData(UNKNOWN, fetchSafe, "the fee Safe");
  const contractUrl = REGISTRY ? etherscanUrl("address", REGISTRY.address) : null;
  const signers = safe ? t("names.faq.signers", safe) : t("names.faq.signersUnknown");

  return (
    <section id="faq" className="rl-section" aria-labelledby="nm-faq-title">
      <p className="nm-eyebrow">{t("names.faq.eyebrow")}</p>
      <h2 id="nm-faq-title" className="rl-section-title">
        {t("names.faq.title")}
      </h2>
      <p className="rl-section-lead">{t("names.faq.lead")}</p>

      {GROUPS.map((group) => (
        <div key={group.key} className="nm-faq-group">
          <h3 className="nm-faq-group-title">{t(`names.faq.groups.${group.key}`)}</h3>
          <div className="nm-faq glass-card">
            {group.items.map((id) => {
              const answer = t(`names.faq.items.${id}.a`, {
                returnObjects: true,
                signers,
              }) as string[];
              return (
                <details key={id} id={`faq-${id}`} className="nm-faq-item">
                  <summary className="nm-faq-question">{t(`names.faq.items.${id}.q`)}</summary>
                  <div className="nm-faq-answer">
                    {answer.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {id === "cost" && (
                      <table className="nm-faq-prices">
                        <thead>
                          <tr>
                            <th scope="col">{t("names.faq.priceLength")}</th>
                            <th scope="col">{t("names.faq.pricePerYear")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {PRICE_LENGTHS.map((bytes) => (
                            <tr key={bytes}>
                              <td>
                                {bytes === 5
                                  ? t("names.faq.bytesOrMore", { count: bytes })
                                  : t("names.faq.bytes", { count: bytes })}
                              </td>
                              <td>{format.eth(feeForLength(bytes))}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      ))}

      <p className="nm-faq-links">
        {contractUrl && (
          <a className="rl-link" href={contractUrl} target="_blank" rel="noreferrer">
            {t("names.faq.contract")}
          </a>
        )}
        <a className="rl-link" href={BSO_FEE_SAFE_URL} target="_blank" rel="noreferrer">
          {t("names.faq.safe")}
        </a>
        <a className="rl-link" href={BSO_REGISTRY_BSIP_URL} target="_blank" rel="noreferrer">
          {t("names.faq.spec")}
        </a>
      </p>
    </section>
  );
}
