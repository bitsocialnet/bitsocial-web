import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { type Address, type Hash, isAddressEqual } from "viem";
import { isKeyAddress } from "@/lib/names/key-address";
import {
  findPendingClaim,
  type PendingClaim,
  removePendingClaim,
  savePendingClaim,
} from "@/lib/names/pending";
import {
  etherscanUrl,
  feeForLength,
  makeCommitment,
  MAX_COMMITMENT_AGE,
  MIN_COMMITMENT_AGE,
  type NameState,
  publicClient,
  type Registration,
  randomSecret,
  RECORD_KEY,
  REGISTRY,
  REGISTRY_ABI,
  tokenIdFor,
} from "@/lib/names/registry";
import {
  connectWallet,
  describeError,
  sendRegistryCall,
  type TransactionProblem,
  useWallets,
  type WalletOption,
} from "@/lib/names/wallet";
import { countdown, shortAddress, Ticking, useNamesFormat } from "./format";
import type { Kind } from "./kind";
import OutboundLink from "./OutboundLink";

export type ConnectedWallet = { option: WalletOption; account: Address };

type Step = "commit" | "reveal" | "renew" | "record";
type Activity = { step: Step; hash: Hash | null } | null;

// The reveal is simulated against the latest block, which trails this browser's clock by up to
// one 12-second slot, and the clocks can differ by a few seconds. Waiting this much past the
// 60-second minimum keeps the reveal from being checked against a block that is still too early.
const CLOCK_MARGIN = 15;

export default function ClaimSection({
  kind,
  label,
  bytes,
  nameState,
  opening,
  nowMs,
  wallet,
  onWallet,
  onChanged,
}: {
  kind: Kind;
  label: string | null;
  bytes: number;
  nameState: NameState | null;
  opening: number | null;
  nowMs: number;
  wallet: ConnectedWallet | null;
  onWallet: (wallet: ConnectedWallet) => void;
  onChanged: (registration?: Registration) => void;
}) {
  const { t, i18n } = useTranslation();
  const format = useNamesFormat();
  const wallets = useWallets();
  const [connecting, setConnecting] = useState(false);
  const [activity, setActivity] = useState<Activity>(null);
  const [problem, setProblem] = useState<TransactionProblem | null>(null);
  const [done, setDone] = useState<{ step: Step; hash: Hash; label: string } | null>(null);
  const [recordInput, setRecordInput] = useState("");
  const [, setPendingVersion] = useState(0);

  const isProfile = kind === "profile";
  const name = label ? `${label}.bso` : null;
  const now = nowMs / 1000;
  const account = wallet?.account ?? null;
  const owned =
    nameState?.status === "taken" && account !== null && isAddressEqual(nameState.owner, account);
  const mode =
    !label || !nameState || !REGISTRY
      ? "idle"
      : nameState.status === "available" || nameState.status === "premium"
        ? "register"
        : nameState.status === "grace"
          ? "renew"
          : owned
            ? "record"
            : "idle";
  // Read on every render: savePendingClaim/removePendingClaim bump the version to re-render.
  const pending = mode === "register" && label && account ? findPendingClaim(label, account) : null;
  const fee = feeForLength(bytes);
  const premium = nameState?.status === "premium" ? nameState.premium : 0n;
  const busy = activity !== null;
  const bumpPending = () => setPendingVersion((value) => value + 1);

  async function run(step: Step, action: (onSent: (hash: Hash) => void) => Promise<Hash>) {
    setProblem(null);
    setDone(null);
    setActivity({ step, hash: null });
    try {
      const hash = await action((sent) => setActivity({ step, hash: sent }));
      if (label) setDone({ step, hash, label });
    } catch (error) {
      console.warn(`The ${step} transaction failed.`, error);
      setProblem(describeError(error));
    } finally {
      setActivity(null);
    }
  }

  async function connect(option: WalletOption) {
    setProblem(null);
    setConnecting(true);
    try {
      onWallet({ option, account: await connectWallet(option) });
    } catch (error) {
      setProblem(describeError(error));
    } finally {
      setConnecting(false);
    }
  }

  function reserve() {
    if (!wallet || !label || !REGISTRY) return;
    const registry = REGISTRY.address;
    const secret = randomSecret();
    const commitment = makeCommitment(label, wallet.account, secret);
    void run("commit", async (onSent) => {
      const claim = (committedAt: number, commitTx: Hash): PendingClaim => ({
        registry,
        label,
        owner: wallet.account,
        secret,
        committedAt,
        commitTx,
      });
      const receipt = await sendRegistryCall(
        wallet.option,
        wallet.account,
        { functionName: "commit", args: [commitment] },
        (hash) => {
          // Saved as soon as the wallet signs, so a closed tab keeps the secret.
          savePendingClaim(claim(Math.floor(Date.now() / 1000), hash));
          bumpPending();
          onSent(hash);
        },
      );
      const block = await publicClient.getBlock({ blockNumber: receipt.blockNumber });
      savePendingClaim(claim(Number(block.timestamp), receipt.transactionHash));
      bumpPending();
      return receipt.transactionHash;
    });
  }

  function claim(claimToReveal: PendingClaim) {
    if (!wallet || !REGISTRY) return;
    const registry = REGISTRY.address;
    void run("reveal", async (onSent) => {
      // The premium only falls, so today's figure covers it; the registry refunds the rest.
      const livePremium = await publicClient.readContract({
        address: registry,
        abi: REGISTRY_ABI,
        functionName: "getPremium",
        args: [tokenIdFor(claimToReveal.label)],
      });
      const receipt = await sendRegistryCall(
        wallet.option,
        wallet.account,
        {
          functionName: "reveal",
          args: [claimToReveal.label, claimToReveal.secret],
          value: fee + livePremium,
        },
        onSent,
      );
      removePendingClaim(claimToReveal);
      bumpPending();
      onChanged({
        tokenId: tokenIdFor(claimToReveal.label),
        label: claimToReveal.label,
        owner: wallet.account,
        registeredAt: Math.floor(Date.now() / 1000),
        txHash: receipt.transactionHash,
      });
      return receipt.transactionHash;
    });
  }

  function startOver(claimToDrop: PendingClaim) {
    removePendingClaim(claimToDrop);
    bumpPending();
    setProblem(null);
  }

  function renew() {
    if (!wallet || !label) return;
    void run("renew", async (onSent) => {
      const receipt = await sendRegistryCall(
        wallet.option,
        wallet.account,
        { functionName: "renew", args: [tokenIdFor(label)], value: fee },
        onSent,
      );
      onChanged();
      return receipt.transactionHash;
    });
  }

  const recordValue = recordInput.trim();
  const recordValid = isKeyAddress(recordValue);

  function saveRecord() {
    if (!wallet || !label || !recordValid) return;
    void run("record", async (onSent) => {
      const receipt = await sendRegistryCall(
        wallet.option,
        wallet.account,
        { functionName: "setText", args: [tokenIdFor(label), RECORD_KEY, recordValue] },
        onSent,
      );
      onChanged();
      return receipt.transactionHash;
    });
  }

  const status = (step: Step): ReactNode => {
    if (activity?.step === step) {
      return (
        <p className="nm-step-status" role="status">
          {activity.hash ? t("names.claim.waitingForTx") : t("names.claim.confirmInWallet")}
          {activity.hash && <TxLink hash={activity.hash} />}
        </p>
      );
    }
    if (done?.step === step && done.label === label) {
      const text =
        step === "record"
          ? t(isProfile ? "names.claim.doneProfile" : "names.claim.doneCommunity", { name })
          : step === "renew" && nameState && "expiresAt" in nameState
            ? t("names.claim.renewed", { date: format.date(nameState.expiresAt) })
            : null;
      return (
        <p className="nm-step-status" data-tone="ok" role="status">
          {text}
          <TxLink hash={done.hash} />
        </p>
      );
    }
    return null;
  };

  const problemText =
    problem &&
    (problem.kind === "rejected"
      ? t("names.claim.rejected")
      : problem.kind === "revert"
        ? i18n.exists(`names.claim.errors.${problem.error}`)
          ? t(`names.claim.errors.${problem.error}`)
          : t("names.claim.reverted", { error: problem.error })
        : t("names.claim.failed", { message: problem.message }));

  // Step 2 becomes available 60 seconds after the commitment, and not before the opening.
  const readyAt = pending
    ? Math.max(pending.committedAt + MIN_COMMITMENT_AGE + CLOCK_MARGIN, opening ?? 0)
    : null;
  const notOpen = opening !== null && now < opening;
  const reserveFrom = opening !== null ? opening - MAX_COMMITMENT_AGE + 300 : null;
  const tooEarly = notOpen && reserveFrom !== null && now < reserveFrom;

  const connectBlock = !wallet && mode !== "idle" && (
    <div className="nm-connect">
      {wallets.length === 0 ? (
        <p className="nm-connect-note">{t("names.claim.noWallet")}</p>
      ) : (
        wallets.map((option) => (
          <button
            key={option.id}
            type="button"
            className="nm-button nm-button-primary"
            disabled={connecting}
            onClick={() => void connect(option)}
          >
            {option.icon && <img src={option.icon} alt="" width={20} height={20} />}
            {connecting
              ? t("names.claim.connecting")
              : wallets.length === 1 && !option.name
                ? t("names.claim.connect")
                : t("names.claim.connectWith", {
                    wallet: option.name || t("names.claim.browserWallet"),
                  })}
          </button>
        ))
      )}
    </div>
  );

  const header = (
    <div className="nm-claim-head">
      <p className="nm-claim-current">
        {mode === "idle" || !name
          ? t("names.claim.pickName")
          : mode === "renew"
            ? t("names.claim.renewing", { name })
            : mode === "record"
              ? t("names.claim.pointing", { name })
              : t("names.claim.claiming", { name })}
      </p>
      {wallet && (
        <p className="nm-claim-account">
          {t("names.claim.connectedAs", { address: shortAddress(wallet.account) })}
        </p>
      )}
    </div>
  );
  // A renewal moves an expired name back to "registered", which closes the renew card, so its
  // confirmation shows under the header instead.
  const renewedNote = mode !== "renew" && status("renew");

  const priceText = format.eth(fee + premium);

  return (
    <div id="claim" className="nm-claim">
      <p className="nm-eyebrow">{t("names.claim.eyebrow")}</p>
      <h2 className="rl-section-title">{t("names.claim.title")}</h2>
      {header}
      {renewedNote}
      {connectBlock}
      {problemText && (
        <p className="nm-problem" role="alert">
          {problemText}
        </p>
      )}

      {mode === "renew" ? (
        <ol className="nm-steps">
          <li className="nm-step glass-card" data-state="current">
            <span className="nm-step-number">01</span>
            <div className="nm-step-body">
              <h3 className="nm-step-title">{t("names.claim.renewTitle")}</h3>
              <p className="nm-step-text">{t("names.claim.renewBody")}</p>
              <p className="nm-step-meta">
                {t("names.claim.renewMeta", { price: format.eth(fee) })}
              </p>
              {wallet && (
                <button
                  type="button"
                  className="nm-button nm-button-primary"
                  disabled={busy}
                  onClick={renew}
                >
                  {t("names.claim.renewAction", { name, price: format.eth(fee) })}
                </button>
              )}
              {status("renew")}
            </div>
          </li>
        </ol>
      ) : (
        <ol className="nm-steps">
          <li
            className="nm-step glass-card"
            data-state={
              mode === "register"
                ? pending
                  ? "done"
                  : "current"
                : mode === "record"
                  ? "done"
                  : "upcoming"
            }
          >
            <span className="nm-step-number">01</span>
            <div className="nm-step-body">
              <h3 className="nm-step-title">{t("names.claim.reserveTitle")}</h3>
              <p className="nm-step-text">{t("names.claim.reserveBody")}</p>
              <p className="nm-step-meta">{t("names.claim.reserveMeta")}</p>
              {mode === "register" &&
                wallet &&
                !pending &&
                (tooEarly && reserveFrom !== null ? (
                  <p className="nm-step-status">
                    {t("names.claim.reserveTooEarly", { date: format.dateTime(reserveFrom) })}
                  </p>
                ) : (
                  <button
                    type="button"
                    className="nm-button nm-button-primary"
                    disabled={busy}
                    onClick={reserve}
                  >
                    {t("names.claim.reserveAction", { name })}
                  </button>
                ))}
              {pending && activity?.step !== "commit" && (
                <p className="nm-step-status" data-tone="ok">
                  {t("names.claim.reserved", {
                    time: format.dateTime(pending.committedAt + MAX_COMMITMENT_AGE),
                  })}
                  <TxLink hash={pending.commitTx} />
                </p>
              )}
              {status("commit")}
            </div>
          </li>

          <li
            className="nm-step glass-card"
            data-state={mode === "record" ? "done" : pending ? "current" : "upcoming"}
          >
            <span className="nm-step-number">02</span>
            <div className="nm-step-body">
              <h3 className="nm-step-title">{t("names.claim.claimTitle")}</h3>
              <p className="nm-step-text">{t("names.claim.claimBody")}</p>
              <p className="nm-step-meta">{t("names.claim.claimMeta", { price: priceText })}</p>
              {pending && wallet && readyAt !== null && (
                <div className="nm-step-actions">
                  <Ticking>
                    {(nowSeconds) =>
                      nowSeconds < readyAt ? (
                        <button type="button" className="nm-button nm-button-primary" disabled>
                          {opening !== null && readyAt === opening
                            ? t("names.claim.claimWaitOpening", {
                                time: countdown(opening - nowSeconds),
                              })
                            : t("names.claim.claimWait", {
                                seconds: Math.ceil(readyAt - nowSeconds),
                              })}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="nm-button nm-button-primary"
                          disabled={busy}
                          onClick={() => claim(pending)}
                        >
                          {t("names.claim.claimAction", { name, price: priceText })}
                        </button>
                      )
                    }
                  </Ticking>
                  {!busy && (
                    <button
                      type="button"
                      className="nm-inline-button"
                      onClick={() => startOver(pending)}
                    >
                      {t("names.claim.startOver")}
                    </button>
                  )}
                </div>
              )}
              {status("reveal")}
            </div>
          </li>

          <li
            className="nm-step nm-step-record glass-card"
            data-state={mode === "record" ? "current" : "upcoming"}
          >
            <span className="nm-step-number">03</span>
            <div className="nm-step-body">
              <h3 className="nm-step-title">
                {t(
                  isProfile ? "names.claim.recordTitleProfile" : "names.claim.recordTitleCommunity",
                )}
              </h3>
              <label htmlFor="nm-record" className="nm-step-text">
                {t(
                  isProfile ? "names.claim.recordLabelProfile" : "names.claim.recordLabelCommunity",
                )}
              </label>
              <div className="nm-record-row">
                <input
                  id="nm-record"
                  className="nm-field nm-field-mono"
                  type="text"
                  value={recordInput}
                  onChange={(event) => setRecordInput(event.target.value)}
                  placeholder="12D3KooW…"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  disabled={mode !== "record" || busy}
                  aria-invalid={recordValue !== "" && !recordValid}
                  aria-describedby="nm-record-hint"
                />
                {mode === "record" && (
                  <button
                    type="button"
                    className="nm-button nm-button-primary"
                    disabled={busy || !recordValid}
                    onClick={saveRecord}
                  >
                    {t("names.claim.recordAction")}
                  </button>
                )}
              </div>
              <p id="nm-record-hint" className="nm-step-meta">
                {recordValue !== "" && !recordValid
                  ? t("names.claim.recordInvalid")
                  : mode === "record" && nameState?.status === "taken" && nameState.record
                    ? t("names.claim.recordCurrent", { record: nameState.record })
                    : t("names.claim.recordMeta")}
              </p>
              {status("record")}
            </div>
          </li>
        </ol>
      )}
    </div>
  );
}

function TxLink({ hash }: { hash: Hash }) {
  const { t } = useTranslation();
  const url = etherscanUrl("tx", hash);
  if (!url) return null;
  return (
    <>
      {" "}
      <OutboundLink href={url}>{t("names.claim.viewTx")}</OutboundLink>
    </>
  );
}
