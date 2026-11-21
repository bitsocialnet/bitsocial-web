import { type ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { type Address, type Hash, isAddressEqual } from "viem";
import { isKeyAddress } from "@/lib/names/key-address";
import {
  findPendingClaim,
  type PendingClaim,
  pendingClaimsSaved,
  removePendingClaim,
  savePendingClaim,
} from "@/lib/names/pending";
import {
  etherscanUrl,
  feeForLength,
  lookupName,
  makeCommitment,
  MAX_COMMITMENT_AGE,
  MIN_COMMITMENT_AGE,
  type NameState,
  publicClient,
  readCommitmentTime,
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
  RegistryCallFailed,
  sendRegistryCall,
  type TransactionProblem,
  useWallets,
  type WalletOption,
} from "@/lib/names/wallet";
import { cn } from "@/lib/utils";
import { countdown, shortAddress, Ticking, useNamesFormat } from "./format";
import type { Kind } from "./kind";
import { type Opening, RESERVE_WINDOW } from "./opening";
import OutboundLink from "./OutboundLink";

export type ConnectedWallet = { option: WalletOption; account: Address };

type Step = "commit" | "reveal" | "renew" | "record";
// The name and account a transaction is for: `scope` (see below) and the two parts, for display.
type For = { scope: string; label: string; account: Address | null };
type Activity = ({ step: Step; hash: Hash | null; sentAt: number | null } & For) | null;

// The reveal is simulated against the latest block, which trails this browser's clock by up to
// one 12-second slot, and the clocks can differ by a few seconds. Waiting this much past the
// 60-second minimum keeps the reveal from being checked against a block that is still too early.
const CLOCK_MARGIN = 15;
// How long a sent transaction waits before the visitor is offered to stop waiting for it: long
// enough that a normal one is mined first, since sending the same action again could pay twice.
const STOP_WAITING_AFTER = 5 * 60;
// How often an unconfirmed reservation checks whether its commit has been mined.
const CONFIRM_POLL_MS = 12_000;

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
  opening: Opening;
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
  // A transaction the visitor stopped waiting for: it may still be mined, so the page says so.
  const [unresolved, setUnresolved] = useState<({ step: Step; hash: Hash } & For) | null>(null);
  const [problemState, setProblemState] = useState<{
    for: string;
    problem: TransactionProblem;
  } | null>(null);
  const [done, setDone] = useState<{ step: Step; hash: Hash; label: string } | null>(null);
  // Kept with the name and account it was typed for (see `scope`), so it never goes to another.
  const [recordDraft, setRecordDraft] = useState({ for: "", value: "" });
  const [, setPendingVersion] = useState(0);

  const isProfile = kind === "profile";
  const name = label ? `${label}.bso` : null;
  const now = nowMs / 1000;
  const account = wallet?.account ?? null;
  // Errors and the record draft belong to one name and wallet account: switching either hides
  // them, so a message about one name never shows under another.
  const scope = `${label ?? ""}|${account ?? ""}`;
  const problem = problemState?.for === scope ? problemState.problem : null;
  const setProblem = (next: TransactionProblem | null, forScope = scope) =>
    setProblemState(next && { for: forScope, problem: next });
  const owned =
    nameState?.status === "taken" && account !== null && isAddressEqual(nameState.owner, account);
  // Anyone can renew a registered name (BSIP-13), so a friend can keep it alive; only its holder
  // can point it, and the holder's cards include renewal too.
  const mode =
    !label || !nameState || !REGISTRY
      ? "idle"
      : nameState.status === "available" || nameState.status === "premium"
        ? "register"
        : owned
          ? "record"
          : "renew";
  // Read on every render: savePendingClaim/removePendingClaim bump the version to re-render.
  const pending = mode === "register" && label && account ? findPendingClaim(label, account) : null;
  const fee = feeForLength(bytes);
  const premium = nameState?.status === "premium" ? nameState.premium : 0n;
  const busy = activity !== null;
  const bumpPending = () => setPendingVersion((value) => value + 1);

  // A reservation saved when the wallet signed waits for the registry's record of its commit,
  // which gives the time the reveal is counted from. This also picks up a commit from a tab that
  // closed before it was mined, or one the wallet sped up under another hash.
  const unconfirmedTx = pending && !pending.confirmed ? pending.commitTx : null;
  // Only a commit for the name and account on screen; another name's commit runs on regardless.
  const committing = activity?.step === "commit" && activity.scope === scope;
  useEffect(() => {
    if (!unconfirmedTx || !label || !account || committing) return;
    let stopped = false;
    let timer: number | undefined;
    const settle = (update: () => void) => {
      update();
      setPendingVersion((value) => value + 1);
    };
    const check = async () => {
      const claimToConfirm = findPendingClaim(label, account);
      if (!claimToConfirm || claimToConfirm.confirmed) return;
      try {
        const { owner, secret, commitTx } = claimToConfirm;
        const committedAt = await readCommitmentTime(makeCommitment(label, owner, secret));
        if (stopped) return;
        if (committedAt !== null) {
          settle(() => savePendingClaim({ ...claimToConfirm, committedAt, confirmed: true }));
          return;
        }
        const receipt = await publicClient
          .getTransactionReceipt({ hash: commitTx })
          .catch(() => null);
        if (stopped) return;
        if (receipt?.status === "reverted") {
          settle(() => removePendingClaim(claimToConfirm));
          return;
        }
      } catch (error) {
        console.warn("Could not check the reservation.", error);
      }
      if (!stopped) timer = window.setTimeout(() => void check(), CONFIRM_POLL_MS);
    };
    void check();
    return () => {
      stopped = true;
      window.clearTimeout(timer);
    };
  }, [unconfirmedTx, label, account, committing]);

  // The running transaction, so Start over can give up on a commit that may never be mined.
  const runningRef = useRef<AbortController | null>(null);

  async function run(
    step: Step,
    action: (onSent: (hash: Hash) => void, signal: AbortSignal) => Promise<Hash>,
  ) {
    const controller = new AbortController();
    runningRef.current = controller;
    // The name and account this action is for, which the visitor may change while it runs.
    const runScope = scope;
    setProblem(null);
    setDone(null);
    setUnresolved(null);
    const runFor: For = { scope: runScope, label: label ?? "", account };
    setActivity({ step, hash: null, sentAt: null, ...runFor });
    try {
      const hash = await action((sent) => {
        // A wallet can still approve after the visitor gave up on this run.
        if (!controller.signal.aborted) {
          setActivity({ step, hash: sent, sentAt: Date.now() / 1000, ...runFor });
        }
      }, controller.signal);
      if (label && !controller.signal.aborted) setDone({ step, hash, label });
    } catch (error) {
      if (controller.signal.aborted) return;
      console.warn(`The ${step} transaction failed.`, error);
      const described = describeError(error);
      setProblem(described, runScope);
      // A failure, in simulation or mined, may mean the name changed since it was shown (someone
      // registered it first, say), so read it again. Declining in the wallet changes nothing.
      if (described.kind !== "rejected") onChanged();
    } finally {
      // An abandoned run has already cleared its step, and a newer one may be running.
      if (runningRef.current === controller) {
        runningRef.current = null;
        setActivity(null);
      }
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
    void run("commit", async (onSent, signal) => {
      // The lookup may be minutes old; a name registered since then could never be revealed.
      const fresh = await lookupName(label);
      if (fresh.status !== "available" && fresh.status !== "premium") {
        throw new RegistryCallFailed({ kind: "revert", error: "AlreadyRegistered" });
      }
      const claim = (committedAt: number, confirmed: boolean, commitTx: Hash): PendingClaim => ({
        registry,
        label,
        owner: wallet.account,
        secret,
        committedAt,
        confirmed,
        commitTx,
      });
      const sent: { claim: PendingClaim | null } = { claim: null };
      try {
        const receipt = await sendRegistryCall(
          wallet.option,
          wallet.account,
          { functionName: "commit", args: [commitment] },
          (hash) => {
            // Saved as soon as the wallet signs, so a closed tab keeps the secret.
            sent.claim = claim(Math.floor(Date.now() / 1000), false, hash);
            savePendingClaim(sent.claim);
            bumpPending();
            onSent(hash);
          },
          signal,
        );
        // The commit is mined either way. Without its block time, the unconfirmed claim saved at
        // signing stays, and the check above confirms it from the registry's own record.
        const block = await publicClient
          .getBlock({ blockNumber: receipt.blockNumber })
          .catch(() => null);
        // Start over during that read gave the reservation up; saving it now would bring it back.
        if (signal.aborted) return receipt.transactionHash;
        if (block) {
          savePendingClaim(claim(Number(block.timestamp), true, receipt.transactionHash));
          bumpPending();
        }
        return receipt.transactionHash;
      } catch (error) {
        // Only a commit known not to have run lets go of its secret; after a network error the
        // commit may still be mined, and the unconfirmed reservation goes on checking for it.
        if (sent.claim && error instanceof RegistryCallFailed) {
          removePendingClaim(sent.claim);
          bumpPending();
        }
        throw error;
      }
    });
  }

  function claim(claimToReveal: PendingClaim) {
    if (!wallet || !REGISTRY) return;
    const registry = REGISTRY.address;
    void run("reveal", async (onSent, signal) => {
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
        signal,
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
    // A commit still waiting to be mined is given up on: if it is mined later, nothing uses it.
    if (committing) {
      runningRef.current?.abort();
      runningRef.current = null;
      setActivity(null);
    }
    removePendingClaim(claimToDrop);
    bumpPending();
    setProblem(null);
  }

  // A transaction that is never mined (dropped from the mempool) would keep the step waiting
  // forever. Stopping only stops the page waiting: the transaction is not resent, its link stays,
  // and the name is read again in case it went through after all.
  function stopWaiting() {
    if (!activity?.hash) return;
    const { step, hash, scope: forScope, label: forLabel, account: forAccount } = activity;
    setUnresolved({ step, hash, scope: forScope, label: forLabel, account: forAccount });
    runningRef.current?.abort();
    runningRef.current = null;
    setActivity(null);
    onChanged();
  }

  function renew() {
    if (!wallet || !label) return;
    // An early renewal is a renewal too; the registry adds the year to the current expiry.
    void run("renew", async (onSent, signal) => {
      const receipt = await sendRegistryCall(
        wallet.option,
        wallet.account,
        { functionName: "renew", args: [tokenIdFor(label)], value: fee },
        onSent,
        signal,
      );
      onChanged();
      return receipt.transactionHash;
    });
  }

  const recordInput = recordDraft.for === scope ? recordDraft.value : "";
  const recordValue = recordInput.trim();
  const recordValid = isKeyAddress(recordValue);

  function saveRecord() {
    if (!wallet || !label || !recordValid) return;
    void run("record", async (onSent, signal) => {
      const receipt = await sendRegistryCall(
        wallet.option,
        wallet.account,
        { functionName: "setText", args: [tokenIdFor(label), RECORD_KEY, recordValue] },
        onSent,
        signal,
      );
      onChanged();
      return receipt.transactionHash;
    });
  }

  // A step's card shows its own transaction. When that card isn't on screen (the visitor moved to
  // another name or account, or the name's state changed which cards show), the transaction shows
  // under the header instead, named, so the busy page explains itself and can still be stopped.
  const cardShows = (item: { step: Step } & For) =>
    item.scope === scope && (mode !== "renew" || item.step === "renew");
  const forText = (item: { step: Step } & For) => {
    const forName = `${item.label}.bso`;
    const key =
      item.step === "renew"
        ? "names.claim.renewing"
        : item.step === "record"
          ? "names.claim.pointing"
          : "names.claim.claiming";
    const who = item.account && item.account !== account ? ` (${shortAddress(item.account)})` : "";
    return `${t(key, { name: forName })}${who} · `;
  };

  const activityLine = (current: NonNullable<Activity>, context: string | null) => {
    const sentAt = current.sentAt;
    // A reservation's own card has Start over instead, which also lets go of its secret, as long
    // as the reservation can be read; when it can't (its name's lookup failed), stopping is the
    // way out there too.
    const canStop =
      sentAt !== null && (context !== null || current.step !== "commit" || pending === null);
    return (
      <p className="nm-step-status" role="status">
        {context}
        {current.hash ? t("names.claim.waitingForTx") : t("names.claim.confirmInWallet")}
        {current.hash && <TxLink hash={current.hash} />}
        {canStop && (
          <Ticking>
            {(nowSeconds) =>
              nowSeconds - sentAt >= STOP_WAITING_AFTER && (
                <>
                  {" "}
                  <button type="button" className="nm-inline-button" onClick={stopWaiting}>
                    {t("names.claim.stopWaiting")}
                  </button>
                </>
              )
            }
          </Ticking>
        )}
      </p>
    );
  };

  const unresolvedLine = (item: NonNullable<typeof unresolved>, context: string | null) => (
    <p className="nm-step-status" role="status">
      {context}
      {t("names.claim.unresolved")}
      <TxLink hash={item.hash} />
    </p>
  );

  const elsewhere =
    activity && !cardShows(activity)
      ? activityLine(activity, forText(activity))
      : unresolved && !cardShows(unresolved)
        ? unresolvedLine(unresolved, forText(unresolved))
        : null;

  const status = (step: Step): ReactNode => {
    if (activity?.step === step && cardShows(activity)) return activityLine(activity, null);
    if (unresolved?.step === step && cardShows(unresolved)) return unresolvedLine(unresolved, null);
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

  // Step 2 becomes available 60 seconds after the commit is mined, and not before the opening.
  const openingAt = opening.status === "known" ? opening.at : null;
  const readyAt =
    pending?.confirmed && openingAt !== null
      ? Math.max(
          pending.committedAt + MIN_COMMITMENT_AGE + CLOCK_MARGIN,
          // The same margin keeps the first claim at the opening from being checked against a
          // block from just before it.
          openingAt + CLOCK_MARGIN,
        )
      : null;
  const reserveFrom = openingAt !== null ? openingAt - RESERVE_WINDOW : null;
  const tooEarly = reserveFrom !== null && now < reserveFrom;
  // Shown instead of an action that needs the opening while the registry hasn't said when it is.
  const openingUnknown =
    opening.status === "known" ? null : (
      <p className="nm-step-status" role="status">
        {t(opening.status === "loading" ? "names.checks.checking" : "names.checks.lookupFailed")}
      </p>
    );

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
  // A renewal moves an expired name back to "registered", which closes the renew card. Unless the
  // visitor owns the name, whose cards include early renewal, the confirmation shows up here.
  const renewedNote = mode !== "renew" && mode !== "record" && status("renew");

  const priceText = format.eth(fee + premium);

  return (
    <div id="claim" className="nm-claim">
      <p className="nm-eyebrow">{t("names.claim.eyebrow")}</p>
      <h2 className="rl-section-title">{t("names.claim.title")}</h2>
      {header}
      {elsewhere}
      {renewedNote}
      {connectBlock}
      {problemText && (
        <p className="nm-problem" role="alert">
          {problemText}
        </p>
      )}

      {mode === "renew" ? (
        <ol className="nm-steps">{renewStep("current")}</ol>
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
                (openingUnknown ??
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
                  )))}
              {pending && !committing && (
                <p className="nm-step-status" data-tone={pending.confirmed ? "ok" : undefined}>
                  {pending.confirmed
                    ? t("names.claim.reserved", {
                        time: format.dateTime(pending.committedAt + MAX_COMMITMENT_AGE),
                      })
                    : t("names.claim.waitingForTx")}
                  <TxLink hash={pending.commitTx} />
                </p>
              )}
              {/* A commit that is never mined (dropped, or replaced in the wallet) would
                  otherwise hold the name here with no way out. */}
              {pending && !pending.confirmed && (!busy || committing) && (
                <button
                  type="button"
                  className="nm-inline-button"
                  onClick={() => startOver(pending)}
                >
                  {t("names.claim.startOver")}
                </button>
              )}
              {pending && !pendingClaimsSaved() && (
                <p className="nm-step-status" role="alert">
                  {t("names.claim.notSaved")}
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
              {pending?.confirmed && wallet && readyAt === null && openingUnknown}
              {pending && wallet && readyAt !== null && (
                <div className="nm-step-actions">
                  <Ticking>
                    {(nowSeconds) =>
                      nowSeconds < readyAt ? (
                        <button type="button" className="nm-button nm-button-primary" disabled>
                          {openingAt !== null && readyAt === openingAt + CLOCK_MARGIN
                            ? t("names.claim.claimWaitOpening", {
                                time: countdown(readyAt - nowSeconds),
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
                  onChange={(event) => setRecordDraft({ for: scope, value: event.target.value })}
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
          {mode === "record" && renewStep("upcoming", "04")}
        </ol>
      )}
    </div>
  );

  function renewStep(state: "current" | "upcoming", number = "01") {
    return (
      <li className="nm-step glass-card" data-state={state}>
        <span className="nm-step-number">{number}</span>
        <div className="nm-step-body">
          <h3 className="nm-step-title">{t("names.claim.renewTitle")}</h3>
          <p className="nm-step-text">{t("names.claim.renewBody")}</p>
          <p className="nm-step-meta">{t("names.claim.renewMeta", { price: format.eth(fee) })}</p>
          {wallet && (
            <button
              type="button"
              className={cn(
                "nm-button",
                state === "current" ? "nm-button-primary" : "nm-button-quiet",
              )}
              disabled={busy}
              onClick={renew}
            >
              {t("names.claim.renewAction", { name, price: format.eth(fee) })}
            </button>
          )}
          {status("renew")}
        </div>
      </li>
    );
  }
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
