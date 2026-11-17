import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { isAddressEqual } from "viem";
import { feeForLength, MAX_COMMITMENT_AGE, REGISTRY } from "@/lib/names/registry";
import type { Spelling } from "@/lib/names/spelling";
import { BSO_FEE_SAFE_ADDRESS } from "@/lib/site";
import { countdown, shortAddress, shortKey, Ticking, useNamesFormat } from "./format";
import type { Kind } from "./kind";
import type { Lookup } from "./use-name-lookup";

const SAMPLE_KEY = "12D3KooWNsF2eMrdw3YFPycAaFEvZ9Eq3ekhNL3vrAAfN6dAwXLp";
const TRIES = ["cryptomemes", "memes", "5chan", "relationship_advice"];

type Tone = "ok" | "warn" | "bad" | "neutral";
type Check = { key: string; label: string; text: ReactNode; tone: Tone };

export default function NamePlate({
  kind,
  query,
  onQuery,
  spelling,
  lookup,
  onRetry,
  account,
  opening,
  nowMs,
}: {
  kind: Kind;
  query: string;
  onQuery: (value: string) => void;
  spelling: Spelling | null;
  lookup: Lookup;
  onRetry: () => void;
  account: `0x${string}` | null;
  opening: number | null;
  nowMs: number;
}) {
  const { t } = useTranslation();
  const format = useNamesFormat();
  const isProfile = kind === "profile";
  const label = spelling?.ok ? spelling.label : null;
  const name = label ? `${label}.bso` : null;
  const fee = spelling?.ok ? feeForLength(spelling.bytes) : null;
  const now = nowMs / 1000;
  const notOpen = opening !== null && now < opening;
  // A commitment is only valid for 24 hours, so reserving more than a day ahead would lapse.
  const canReserve = !notOpen || opening - now < MAX_COMMITMENT_AGE - 300;

  const placeholder = t(
    isProfile ? "names.plate.placeholderProfile" : "names.plate.placeholderCommunity",
  );
  const shown = name ?? `${query.trim().replace(/\.bso$/i, "") || placeholder}.bso`;
  const initial = (label ?? query.trim()).slice(0, 1).toUpperCase() || "?";
  const state = lookup.status === "ready" ? lookup.state : null;
  const owned =
    state?.status === "taken" && account !== null && isAddressEqual(state.owner, account);
  const reserved = state?.status === "taken" && isAddressEqual(state.owner, BSO_FEE_SAFE_ADDRESS);

  const checks: Check[] = [spellingCheck(), availabilityCheck(), priceCheck()];
  const overall: Tone =
    spelling === null
      ? "neutral"
      : checks.some((c) => c.tone === "bad")
        ? "bad"
        : checks.every((c) => c.tone === "ok")
          ? "ok"
          : "neutral";

  function spellingCheck(): Check {
    const base = { key: "spelling", label: t("names.checks.spelling") };
    if (!spelling) return { ...base, text: t("names.checks.typeName"), tone: "neutral" };
    if (spelling.ok) return { ...base, text: t("names.checks.spellingOk"), tone: "ok" };
    const text =
      spelling.problem === "character"
        ? spelling.character
          ? t("names.checks.character", { character: spelling.character })
          : t("names.checks.characterUnknown")
        : t(`names.checks.${spelling.problem}`);
    return { ...base, text, tone: "bad" };
  }

  function availabilityCheck(): Check {
    const base = { key: "availability", label: t("names.checks.availability") };
    if (!spelling?.ok) {
      return {
        ...base,
        text: t(spelling ? "names.checks.fixFirst" : "names.checks.typeName"),
        tone: "neutral",
      };
    }
    if (!REGISTRY) return { ...base, text: t("names.checks.notDeployed"), tone: "neutral" };
    if (lookup.status === "loading" || lookup.status === "idle") {
      return { ...base, text: t("names.checks.checking"), tone: "neutral" };
    }
    if (lookup.status === "error") {
      return {
        ...base,
        text: (
          <>
            {t("names.checks.lookupFailed")}{" "}
            <button type="button" className="nm-inline-button" onClick={onRetry}>
              {t("names.checks.retry")}
            </button>
          </>
        ),
        tone: "bad",
      };
    }
    const s = lookup.state;
    switch (s.status) {
      case "available":
        return { ...base, text: t("names.checks.available"), tone: "ok" };
      case "premium":
        return {
          ...base,
          text: t("names.checks.premium", {
            date: format.date(s.releasedAt),
            end: format.date(s.releasedAt + 21 * 86_400),
          }),
          tone: "warn",
        };
      case "grace":
        return {
          ...base,
          text: t("names.checks.grace", {
            date: format.date(s.expiresAt),
            until: format.date(s.expiresAt + 90 * 86_400),
          }),
          tone: "warn",
        };
      case "taken":
        if (owned)
          return {
            ...base,
            text: t("names.checks.yours", { date: format.date(s.expiresAt) }),
            tone: "ok",
          };
        return {
          ...base,
          text: t(reserved ? "names.checks.reserved" : "names.checks.taken", {
            date: format.date(s.expiresAt),
          }),
          tone: "bad",
        };
    }
  }

  function priceCheck(): Check {
    const base = { key: "price", label: t("names.checks.price") };
    if (!spelling?.ok || fee === null) return { ...base, text: "—", tone: "neutral" };
    if (state?.status === "premium") {
      return {
        ...base,
        text: t("names.checks.withPremium", {
          price: format.eth(fee + state.premium),
          premium: format.eth(state.premium),
        }),
        tone: "warn",
      };
    }
    const ascii = spelling.bytes === spelling.label.length;
    const text = !ascii
      ? t("names.checks.yearlyBytes", { price: format.eth(fee), count: spelling.bytes })
      : spelling.bytes < 5
        ? t("names.checks.yearlyShort", { price: format.eth(fee), count: spelling.bytes })
        : t("names.checks.yearly", { price: format.eth(fee) });
    return { ...base, text, tone: "ok" };
  }

  let action: ReactNode = null;
  let note: ReactNode = null;
  if (spelling && !spelling.ok && spelling.suggestion) {
    const suggestion = spelling.suggestion;
    action = (
      <button
        type="button"
        className="nm-button nm-button-quiet"
        onClick={() => onQuery(suggestion)}
      >
        {t("names.cta.fix", { name: `${suggestion}.bso` })}
      </button>
    );
  } else if (name && fee !== null && !REGISTRY) {
    action = <span className="nm-button nm-button-muted">{t("names.cta.soon")}</span>;
    note = t("names.cta.noteNotDeployed");
  } else if (name && fee !== null && state) {
    if (state.status === "available" || state.status === "premium") {
      if (notOpen && !canReserve) {
        note = t("names.cta.noteReserveLater");
      } else {
        action = (
          <a className="nm-button nm-button-primary" href="#claim">
            {notOpen
              ? t("names.cta.reserve", { name })
              : t("names.cta.claim", { name, price: format.eth(fee + state.premium) })}
            <ArrowIcon />
          </a>
        );
        note = notOpen
          ? t("names.cta.noteReserve")
          : state.status === "premium"
            ? t("names.cta.notePremium")
            : t("names.cta.noteClaim");
      }
    } else if (state.status === "grace") {
      action = (
        <a className="nm-button nm-button-primary" href="#claim">
          {t("names.cta.renew", { name })}
          <ArrowIcon />
        </a>
      );
      note = t("names.cta.noteGrace");
    } else if (owned) {
      action = (
        <a className="nm-button nm-button-primary" href="#claim">
          {t(isProfile ? "names.cta.pointProfile" : "names.cta.pointCommunity", { name })}
          <ArrowIcon />
        </a>
      );
    } else {
      note = reserved
        ? t("names.cta.noteReserved")
        : t("names.cta.noteTaken", { owner: shortAddress(state.owner) });
    }
  }

  const record = state?.status === "taken" && state.record ? state.record : SAMPLE_KEY;

  return (
    <>
      {notOpen && opening !== null && (
        <p className="nm-opening" role="status">
          <span aria-hidden="true" className="nm-opening-dot" />
          <Ticking>
            {(nowSeconds) =>
              opening - nowSeconds < 86_400
                ? t("names.hero.opensIn", { time: countdown(opening - nowSeconds) })
                : t("names.hero.opensOn", { date: format.dateTime(opening) })
            }
          </Ticking>
        </p>
      )}

      <figure className="nm-plate glass-card">
        <div className="nm-plate-banner">
          <span className="nm-plate-preview">{t("names.plate.preview")}</span>
        </div>
        <div className="nm-plate-body">
          <div className="nm-plate-avatar" data-kind={kind} aria-hidden="true">
            {initial}
          </div>
          <label htmlFor="nm-plate-input" className="sr-only">
            {t(isProfile ? "names.plate.inputLabelProfile" : "names.plate.inputLabelCommunity")}
          </label>
          <div className="nm-plate-name" data-tone={overall}>
            {/* The sizer grows with the text so ".bso" sits right after the name, as on a header. */}
            <span className="nm-plate-sizer" data-value={query || placeholder}>
              <input
                id="nm-plate-input"
                className="nm-plate-input"
                type="text"
                // A one-character intrinsic width lets the hidden copy decide the cell's width.
                size={1}
                value={query}
                onChange={(event) => onQuery(event.target.value)}
                placeholder={placeholder}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
              />
            </span>
            <span className="nm-plate-tld" aria-hidden="true">
              .bso
            </span>
          </div>
          <p className="nm-plate-subline">
            {t(isProfile ? "names.plate.sublineProfile" : "names.plate.sublineCommunity")}
          </p>
          <div className="nm-plate-pills" aria-hidden="true">
            {(isProfile ? ["follow", "posts", "about"] : ["join", "posts", "rules"]).map((pill) => (
              <span key={pill} className="nm-pill">
                {t(`names.plate.${pill}`)}
              </span>
            ))}
          </div>
        </div>
        <div className="nm-plate-footer">
          <ul className="nm-checks" aria-live="polite">
            {checks.map((check) => (
              <li key={check.key} className="nm-check" data-tone={check.tone}>
                <span className="nm-check-icon" aria-hidden="true">
                  {check.tone === "ok"
                    ? "✓"
                    : check.tone === "bad"
                      ? "✕"
                      : check.tone === "warn"
                        ? "!"
                        : "·"}
                </span>
                <span>
                  <span className="nm-check-label">{check.label}</span> · {check.text}
                </span>
              </li>
            ))}
          </ul>
          <div className="nm-plate-action">
            {action}
            {note && <span className="nm-plate-note">{note}</span>}
          </div>
        </div>
        <figcaption className="sr-only">
          {t(isProfile ? "names.plate.captionProfile" : "names.plate.captionCommunity")}
        </figcaption>
      </figure>

      <div className="nm-tries">
        <span>{t("names.plate.try")}</span>
        {TRIES.map((example) => (
          <button key={example} type="button" className="nm-try" onClick={() => onQuery(example)}>
            {example}
          </button>
        ))}
      </div>

      <div className="nm-compare">
        <div className="nm-compare-card">
          <p className="nm-compare-label">
            {t(isProfile ? "names.plate.withoutProfile" : "names.plate.withoutCommunity")}
          </p>
          <p className="nm-compare-key">{isProfile ? shortKey(record) : record}</p>
        </div>
        <div className="nm-compare-card" data-highlight="true">
          <p className="nm-compare-label">
            {t(isProfile ? "names.plate.withProfile" : "names.plate.withCommunity")}
          </p>
          <p className="nm-compare-name">{shown}</p>
        </div>
      </div>
    </>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
