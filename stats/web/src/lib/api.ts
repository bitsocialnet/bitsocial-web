import { useMemo, useSyncExternalStore } from "react";

// A small cache of API responses shared by every component. A path refreshes once a minute while
// at least one component subscribes to it and the tab is visible; switching views or ranges
// reuses what is already loaded.

const REFRESH_MS = 60_000;
const RETRY_MS = 15_000;
const CHECK_MS = 5_000;

interface Entry {
  data?: unknown;
  error?: string;
  fetchedAt?: number;
  failedAt?: number;
  loading: boolean;
}

const entries = new Map<string, Entry>();
// The latest data per view, kept so a range change can show the previous chart until the new one
// arrives instead of flashing empty.
const latestByView = new Map<string, unknown>();
const listeners = new Set<() => void>();
const watchers = new Map<string, { count: number; stop: () => void }>();
let version = 0;

const notify = () => {
  version += 1;
  for (const listener of listeners) {
    listener();
  }
};

const viewKey = (path: string) => path.split("?")[0];

const load = async (path: string) => {
  const current = entries.get(path);
  if (current?.loading) {
    return;
  }
  entries.set(path, { ...current, loading: true });
  notify();
  try {
    const response = await fetch(path, { headers: { Accept: "application/json" } });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.error || `The stats API answered ${response.status}.`);
    }
    const body: unknown = await response.json();
    entries.set(path, { data: body, fetchedAt: Date.now(), loading: false });
    latestByView.set(viewKey(path), body);
  } catch (error) {
    entries.set(path, {
      ...entries.get(path),
      error: error instanceof Error ? error.message : "The stats API is unreachable.",
      failedAt: Date.now(),
      loading: false,
    });
  }
  notify();
};

const refreshIfStale = (path: string) => {
  const entry = entries.get(path);
  const now = Date.now();
  const due = !entry?.fetchedAt || now - entry.fetchedAt >= REFRESH_MS;
  const backingOff = entry?.failedAt !== undefined && now - entry.failedAt < RETRY_MS;
  if (!document.hidden && due && !backingOff) {
    void load(path);
  }
};

// The first subscriber to a path starts its refresh timer and the last one stops it.
const watch = (path: string) => {
  const watcher = watchers.get(path);
  if (watcher) {
    watcher.count += 1;
    return;
  }
  const check = () => refreshIfStale(path);
  const interval = window.setInterval(check, CHECK_MS);
  document.addEventListener("visibilitychange", check);
  queueMicrotask(check);
  watchers.set(path, {
    count: 1,
    stop: () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", check);
    },
  });
};

const unwatch = (path: string) => {
  const watcher = watchers.get(path);
  if (watcher && --watcher.count === 0) {
    watcher.stop();
    watchers.delete(path);
  }
};

const subscribeTo = (path: string | null) => (listener: () => void) => {
  listeners.add(listener);
  if (path) {
    watch(path);
  }
  return () => {
    listeners.delete(listener);
    if (path) {
      unwatch(path);
    }
  };
};

const getVersion = () => version;

export interface StatsResult<T> {
  data: T | undefined;
  /** True while `data` belongs to another range of the same view. */
  isPrevious: boolean;
  error: string | undefined;
  fetchedAt: number | undefined;
  loading: boolean;
}

export function useStats<T>(path: string | null): StatsResult<T> {
  const subscribe = useMemo(() => subscribeTo(path), [path]);
  useSyncExternalStore(subscribe, getVersion);

  const entry = path ? entries.get(path) : undefined;
  const previous = path && !entry?.data ? latestByView.get(viewKey(path)) : undefined;
  return {
    data: (entry?.data ?? previous) as T | undefined,
    isPrevious: Boolean(previous),
    error: entry?.error,
    fetchedAt: entry?.fetchedAt,
    loading: Boolean(entry?.loading),
  };
}
