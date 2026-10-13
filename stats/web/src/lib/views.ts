export type ViewId = "network" | "5chan" | "seedit";

export interface ViewDefinition {
  id: ViewId;
  path: string;
  label: string;
  logo: string;
  /** CSS color for the view's series and identity marks. */
  color: string;
  /** Tailwind background class for the logo tile. */
  tile: string;
}

export const VIEWS: ViewDefinition[] = [
  {
    id: "network",
    path: "/",
    label: "Network",
    logo: "/logos/bitsocial.webp",
    color: "rgb(var(--network))",
    tile: "bg-[#0b1220]",
  },
  {
    id: "5chan",
    path: "/5chan",
    label: "5chan",
    logo: "/logos/5chan.webp",
    color: "rgb(var(--client-5chan))",
    tile: "bg-[#fde3cf]",
  },
  {
    id: "seedit",
    path: "/seedit",
    label: "Seedit",
    logo: "/logos/seedit.webp",
    color: "rgb(var(--client-seedit))",
    tile: "bg-white",
  },
];

export const viewForPath = (pathname: string) => VIEWS.find((view) => view.path === pathname);

export const clientView = (clientId: string) => VIEWS.find((view) => view.id === clientId);
