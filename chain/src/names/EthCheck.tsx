import { type FormEvent, type ReactNode, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Address } from "viem";
import {
  GRACE_PERIOD,
  lookupName,
  lookupSubname,
  type NameState,
  REGISTRY,
} from "@/lib/names/registry";
import { checkSpelling, type Spelling } from "@/lib/names/spelling";
import { shortAddress, shortKey, spellingProblemText, useNamesFormat } from "./format";

type Result =
  | { kind: "name"; label: string; state: NameState }
  | {
      kind: "subname";
      labels: string[];
      // Null when the subname was never registered. An existing one is inactive while its parent
      // has expired or changed hands, and then it neither resolves nor has a date it runs until.
      found: { owner: Address; active: boolean; until: number; record: string } | null;
    }
  | { kind: "invalid"; spelling: Extract<Spelling, { ok: false }> }
  | { kind: "failed" };

/**
 * Explains the launch airdrop and checks whether a .eth name's .bso twin was seeded, subnames
 * included. `opened` is null while the opening time can't be read.
 */
export default function EthCheck({
  opened,
  onPick,
}: {
  opened: boolean | null;
  onPick: (label: string) => void;
}) {
  const { t } = useTranslation();
  const format = useNamesFormat();
  const [input, setInput] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  // Each check and each edit gets a new number; an answer for an older one is dropped.
  const requestRef = useRef(0);

  function edit(value: string) {
    requestRef.current += 1;
    setInput(value);
    setResult(null);
    setChecking(false);
  }

  async function check(event: FormEvent) {
    event.preventDefault();
    const parts = input
      .trim()
      .replace(/\.(eth|bso)$/i, "")
      .split(".");
    // The last label is the top-level name; the ones before it name a subname under it.
    const spellings = parts.map((part, index) =>
      checkSpelling(part, { topLevel: index === parts.length - 1 }),
    );
    if (!input.trim()) return;
    // An empty label, as in alice..bravo.eth, is a dot where none is allowed.
    if (spellings.some((spelling) => spelling === null)) {
      setResult({
        kind: "invalid",
        spelling: { ok: false, problem: "character", suggestion: null },
      });
      return;
    }
    const invalid = spellings.find((spelling) => spelling?.ok === false);
    if (invalid && !invalid.ok) {
      setResult({ kind: "invalid", spelling: invalid });
      return;
    }
    const labels = spellings.map((spelling) => (spelling?.ok ? spelling.label : ""));
    const request = (requestRef.current += 1);
    setChecking(true);
    try {
      const next = await lookUp(labels);
      if (request === requestRef.current) setResult(next);
    } catch (error) {
      console.warn("Could not check the .eth name.", error);
      if (request === requestRef.current) setResult({ kind: "failed" });
    } finally {
      if (request === requestRef.current) setChecking(false);
    }
  }

  let message: ReactNode = null;
  if (result?.kind === "invalid") message = spellingProblemText(t, result.spelling);
  else if (result?.kind === "failed") message = t("names.checks.lookupFailed");
  else if (result?.kind === "subname") {
    const name = `${result.labels.join(".")}.bso`;
    const parent = `${result.labels.slice(1).join(".")}.bso`;
    const found = result.found;
    message = found?.active ? (
      <>
        {t("names.eth.registered", {
          name,
          owner: shortAddress(found.owner),
          date: format.date(found.until),
        })}
        {found.record && <> {t("names.eth.points", { record: shortKey(found.record) })}</>}
      </>
    ) : found ? (
      t("names.eth.subnameInactive", { name, owner: shortAddress(found.owner), parent })
    ) : opened === null ? (
      t("names.checks.lookupFailed")
    ) : opened ? (
      t("names.eth.subnameNotSeeded", { name, parent })
    ) : (
      t("names.eth.notYet", { name })
    );
  } else if (result?.kind === "name") {
    const name = `${result.label}.bso`;
    const state = result.state;
    if (state.status === "grace") {
      // Expired, so it no longer resolves, but its holder (or anyone) can still renew it.
      message = (
        <>
          {t("names.checks.grace", {
            date: format.date(state.expiresAt),
            until: format.date(state.expiresAt + GRACE_PERIOD),
          })}{" "}
          {t("names.cta.noteTaken", { owner: shortAddress(state.owner) })}
        </>
      );
    } else if (state.status === "taken") {
      message = (
        <>
          {t("names.eth.registered", {
            name,
            owner: shortAddress(state.owner),
            date: format.date(state.expiresAt),
          })}
          {state.record && <> {t("names.eth.points", { record: shortKey(state.record) })}</>}
        </>
      );
    } else if (opened === null) {
      message = t("names.checks.lookupFailed");
    } else if (!opened) {
      message = t("names.eth.notYet", { name });
    } else {
      // Only the current state is known here: a name in its premium was registered once and
      // lapsed, so this says what can be done now rather than whether it was airdropped.
      message = (
        <>
          {t("names.eth.notSeeded", { name, eth: `${result.label}.eth` })}
          {state.status === "premium" && (
            <>
              {" "}
              {t("names.checks.premium", {
                date: format.date(state.releasedAt),
                end: format.date(state.releasedAt + 21 * 86_400),
              })}
            </>
          )}{" "}
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
              onChange={(event) => edit(event.target.value)}
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

async function lookUp(labels: string[]): Promise<Result> {
  const top = labels[labels.length - 1];
  if (labels.length === 1) return { kind: "name", label: top, state: await lookupName(top) };
  const [subname, parent] = await Promise.all([lookupSubname(labels), lookupName(top)]);
  if (!subname) return { kind: "subname", labels, found: null };
  // A subname lasts as long as its top-level name, which gives the date it is held until.
  const active = subname.active && parent.status === "taken";
  const until = parent.status === "taken" ? parent.expiresAt : 0;
  return {
    kind: "subname",
    labels,
    found: { owner: subname.owner, active, until, record: subname.record },
  };
}
