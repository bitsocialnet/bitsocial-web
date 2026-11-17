import { type FormEvent, type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { lookupName, type NameState, REGISTRY } from "@/lib/names/registry";
import { checkSpelling } from "@/lib/names/spelling";
import { shortAddress, shortKey, useNamesFormat } from "./format";

type Result =
  | { label: string; state: NameState }
  | { label: string; invalid: true }
  | { label: string; failed: true };

/** Explains the launch airdrop and checks whether a .eth name's .bso twin was seeded. */
export default function EthCheck({
  opened,
  onPick,
}: {
  opened: boolean;
  onPick: (label: string) => void;
}) {
  const { t } = useTranslation();
  const format = useNamesFormat();
  const [input, setInput] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function check(event: FormEvent) {
    event.preventDefault();
    const raw = input.trim().replace(/\.(eth|bso)$/i, "");
    const spelling = checkSpelling(raw);
    if (!spelling) return;
    if (!spelling.ok) {
      setResult({ label: raw, invalid: true });
      return;
    }
    setChecking(true);
    try {
      setResult({ label: spelling.label, state: await lookupName(spelling.label) });
    } catch (error) {
      console.warn("Could not check the .eth name.", error);
      setResult({ label: spelling.label, failed: true });
    } finally {
      setChecking(false);
    }
  }

  let message: ReactNode = null;
  if (result) {
    const name = `${result.label}.bso`;
    if ("invalid" in result) message = t("names.checks.characterUnknown");
    else if ("failed" in result) message = t("names.checks.lookupFailed");
    else if (result.state.status === "taken" || result.state.status === "grace") {
      message = (
        <>
          {t("names.eth.registered", {
            name,
            owner: shortAddress(result.state.owner),
            date: format.date(result.state.expiresAt),
          })}
          {result.state.status === "taken" && result.state.record && (
            <> {t("names.eth.points", { record: shortKey(result.state.record) })}</>
          )}
        </>
      );
    } else if (!opened) {
      message = t("names.eth.notYet", { name });
    } else {
      message = (
        <>
          {t("names.eth.notSeeded", { name, eth: `${result.label}.eth` })}{" "}
          <button type="button" className="nm-inline-button" onClick={() => onPick(result.label)}>
            {t("names.eth.tryAbove", { name })}
          </button>
        </>
      );
    }
  }

  return (
    <section className="nm-eth glass-card" aria-labelledby="nm-eth-title">
      <div className="nm-eth-copy">
        <p className="nm-eth-badge">{t("names.eth.badge")}</p>
        <h2 id="nm-eth-title" className="nm-card-title nm-card-title-large">
          {t("names.eth.title")}
        </h2>
        <p className="nm-card-text">{t("names.eth.lead")}</p>
        <p className="nm-card-text nm-eth-caveat">{t("names.eth.caveat")}</p>
      </div>
      {REGISTRY && (
        <form className="nm-eth-form" onSubmit={(event) => void check(event)}>
          <label htmlFor="nm-eth-input" className="nm-eth-label">
            {t("names.eth.label")}
          </label>
          <div className="nm-eth-row">
            <input
              id="nm-eth-input"
              className="nm-field"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t("names.eth.placeholder")}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <button
              type="submit"
              className="nm-button nm-button-quiet"
              disabled={checking || !input.trim()}
            >
              {checking ? t("names.checks.checking") : t("names.eth.check")}
            </button>
          </div>
          {message && (
            <p className="nm-eth-result" role="status">
              {message}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
