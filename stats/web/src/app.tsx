import { AppShell } from "@/components/shell";
import { useStats } from "@/lib/api";
import { hrefFor, onLinkClick, useLocation } from "@/lib/router";
import type { Overview } from "@/lib/types";
import { viewForPath } from "@/lib/views";
import { ClientPage } from "@/pages/client-page";
import { NetworkPage } from "@/pages/network-page";

export function App() {
  const { pathname, range } = useLocation();
  // The shell's view buttons read their live counts from the overview on every page.
  const overview = useStats<Overview>(`/api/v1/overview?range=${range}`);
  const view = viewForPath(pathname);
  const home = hrefFor("/", range);

  return (
    <AppShell overview={overview.data}>
      <title>
        {view && view.id !== "network" ? `${view.label} · Bitsocial Stats` : "Bitsocial Stats"}
      </title>
      {view?.id === "network" && <NetworkPage result={overview} range={range} />}
      {view && view.id !== "network" && <ClientPage key={view.id} view={view} range={range} />}
      {!view && (
        <div className="panel p-8 text-center">
          <h1 className="font-display text-xl font-semibold text-ink">Page not found</h1>
          <a
            href={home}
            onClick={onLinkClick(home)}
            className="mt-2 inline-block text-sm text-accent hover:underline"
          >
            Back to the network overview
          </a>
        </div>
      )}
    </AppShell>
  );
}
