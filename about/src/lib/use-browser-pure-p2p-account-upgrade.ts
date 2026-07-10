import { useEffect, useRef } from "react";
import {
  createAccount,
  setAccount as persistAccount,
  useAccount,
  useAccounts,
} from "@bitsocial/bitsocial-react-hooks";
import {
  getBrowserGatewayAccountOptions,
  getBrowserPureP2PAccountOptions,
  shouldDowngradeBrowserPureP2PAccount,
  shouldUpgradeBrowserPureP2PAccount,
} from "@/lib/p2p-runtime";

type AccountShape = Record<string, unknown> & {
  id?: string;
};

const ACCOUNT_RECOVERY_CHECK_MS = 1000;

export function useBrowserPureP2PAccountUpgrade() {
  const account = useAccount() as AccountShape | undefined;
  const { accounts = [] } = useAccounts();
  const recoveryStartedRef = useRef(false);
  const upgradeAccountIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (account?.id || accounts.length > 0) return;

    let disposed = false;

    const intervalId = window.setInterval(() => {
      if (recoveryStartedRef.current) return;
      if (window.BITSOCIAL_REACT_HOOKS_ACCOUNTS_STORE_INITIALIZING) return;

      recoveryStartedRef.current = true;
      void createAccount()
        .then(() => {
          window.location.reload();
        })
        .catch((error: unknown) => {
          if (!disposed) recoveryStartedRef.current = false;
          console.error("Failed to recover missing browser account", error);
        });
    }, ACCOUNT_RECOVERY_CHECK_MS);

    return () => {
      disposed = true;
      window.clearInterval(intervalId);
    };
  }, [account?.id, accounts.length]);

  useEffect(() => {
    const shouldUpgrade = shouldUpgradeBrowserPureP2PAccount(account);
    const shouldDowngrade = shouldDowngradeBrowserPureP2PAccount(account);

    if (!account?.id || (!shouldUpgrade && !shouldDowngrade)) return;
    if (upgradeAccountIdRef.current === account.id) return;

    upgradeAccountIdRef.current = account.id;

    void persistAccount({
      ...account,
      pkcOptions: shouldDowngrade
        ? getBrowserGatewayAccountOptions(account)
        : getBrowserPureP2PAccountOptions(account),
    })
      .then(() => {
        window.location.reload();
      })
      .catch((error: unknown) => {
        upgradeAccountIdRef.current = undefined;
        console.error("Failed to update browser account P2P options", error);
      });
  }, [account]);
}
