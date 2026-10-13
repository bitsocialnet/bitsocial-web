/** Placeholder while a view's first response loads, or the reason it could not. */
export function LoadState({ error }: { error: string | undefined }) {
  return (
    <div className="panel flex min-h-64 flex-col items-center justify-center gap-2 p-8 text-center">
      {error ? (
        <>
          <p className="font-display text-base font-semibold text-ink">Stats are unavailable</p>
          <p className="max-w-md text-sm text-ink-2">{error} The page retries on its own.</p>
        </>
      ) : (
        <p className="text-sm text-ink-3">Loading network stats…</p>
      )}
    </div>
  );
}
