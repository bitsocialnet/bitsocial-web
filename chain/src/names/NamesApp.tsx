import { SpeedInsights } from "@vercel/speed-insights/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAddress } from "viem";
import BackToTop from "@/components/back-to-top";
import Footer from "@/components/footer";
import Topbar, { TopbarSpacer } from "@/components/topbar";
import { readOpening, REGISTRY, type Registration } from "@/lib/names/registry";
import { checkSpelling } from "@/lib/names/spelling";
import { useHashScroll } from "@/lib/use-hash-scroll";
import { useLiveData } from "@/lib/use-live-data";
import { useNow } from "@/lib/use-now";
import PolygonMeshBackground from "@/PolygonMeshBackground";
import Activity from "./Activity";
import ClaimSection, { type ConnectedWallet } from "./ClaimSection";
import EthCheck from "./EthCheck";
import { type Kind, readInitialQuery, writeQuery } from "./kind";
import Lifecycle from "./Lifecycle";
import NamePlate from "./NamePlate";
import NamesFaq from "./NamesFaq";
import { useNameLookup } from "./use-name-lookup";

const initial = readInitialQuery();
const fetchOpening = () => (REGISTRY ? readOpening() : Promise.resolve(null));

export default function NamesApp() {
  useHashScroll();
  const { t } = useTranslation();
  const [query, setQuery] = useState(initial.name);
  const [kind, setKind] = useState<Kind>(initial.kind);
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null);
  const [local, setLocal] = useState<Registration[]>([]);
  // Coarse on purpose: countdowns tick on their own (Ticking), so the page re-renders rarely.
  const nowMs = useNow(15_000);
  const { data: opening } = useLiveData<number | null>(null, fetchOpening, "the .bso registry");

  const spelling = checkSpelling(query);
  const label = spelling?.ok ? spelling.label : null;
  const { lookup, refresh } = useNameLookup(label);
  const isProfile = kind === "profile";

  const changeQuery = (value: string) => {
    setQuery(value);
    writeQuery(value.trim(), kind);
  };
  const changeKind = (value: Kind) => {
    setKind(value);
    writeQuery(query.trim(), value);
  };

  // Follow the wallet when the visitor switches accounts in it.
  useEffect(() => {
    const provider = wallet?.option.provider;
    if (!provider) return;
    const onAccounts = (accounts: string[]) =>
      setWallet((current) =>
        current && accounts[0] ? { ...current, account: getAddress(accounts[0]) } : null,
      );
    provider.on("accountsChanged", onAccounts);
    return () => provider.removeListener("accountsChanged", onAccounts);
  }, [wallet?.option.provider]);

  const onChanged = (registration?: Registration) => {
    refresh();
    if (registration) setLocal((current) => [registration, ...current]);
  };

  return (
    <div className="shell rl-page nm-page">
      <PolygonMeshBackground />
      <Topbar page="names" />
      <TopbarSpacer />

      <main className="shell-main">
        <div className="content-panel">
          <section className="nm-hero" aria-labelledby="nm-hero-title">
            <h1 id="nm-hero-title" className="section-title nm-hero-title">
              {t(isProfile ? "names.hero.titleProfile" : "names.hero.titleCommunity")}
            </h1>
            <p className="nm-hero-lead">
              {t(isProfile ? "names.hero.leadProfile" : "names.hero.leadCommunity")}
            </p>
            <div
              className="rl-segmented nm-kind"
              role="group"
              aria-label={t("names.hero.kindLabel")}
            >
              {(["community", "profile"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  className="rl-segmented-option"
                  aria-pressed={kind === option}
                  onClick={() => changeKind(option)}
                >
                  {t(option === "profile" ? "names.hero.kindProfile" : "names.hero.kindCommunity")}
                </button>
              ))}
            </div>
            {!REGISTRY && <p className="nm-opening">{t("names.hero.notDeployed")}</p>}
            <NamePlate
              kind={kind}
              query={query}
              onQuery={changeQuery}
              spelling={spelling}
              lookup={lookup}
              onRetry={refresh}
              account={wallet?.account ?? null}
              opening={opening}
              nowMs={nowMs}
            />
          </section>

          <section className="rl-section nm-claim-row">
            <ClaimSection
              kind={kind}
              label={label}
              bytes={spelling?.ok ? spelling.bytes : 0}
              nameState={lookup.status === "ready" ? lookup.state : null}
              opening={opening}
              nowMs={nowMs}
              wallet={wallet}
              onWallet={setWallet}
              onChanged={onChanged}
            />
            <Activity local={local} nowMs={nowMs} />
          </section>

          <Lifecycle />

          <div className="rl-section">
            <EthCheck
              opened={opening === null || nowMs / 1000 >= opening}
              onPick={(value) => {
                changeQuery(value);
                document.getElementById("nm-plate-input")?.focus();
              }}
            />
          </div>

          <NamesFaq />

          <Footer />
        </div>
      </main>
      <BackToTop />
      <SpeedInsights />
    </div>
  );
}
