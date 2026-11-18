import { use, type ComponentType } from "react";

const preloaders: Array<() => Promise<void>> = [];

/**
 * Splits a component into its own chunk while keeping it in the server render. The server
 * awaits `preloadDeferredComponents()` before rendering, so the component renders inline. In
 * the browser the surrounding Suspense boundary keeps the server markup on screen and hydrates
 * it once the chunk arrives, which keeps that code out of the download that gates first
 * hydration. Unlike `React.lazy`, a loaded component renders synchronously.
 */
export function deferredComponent<Props extends object>(
  load: () => Promise<{ default: ComponentType<Props> }>,
) {
  let Loaded: ComponentType<Props> | null = null;
  let pending: Promise<void> | null = null;
  const preload = () =>
    (pending ??= load().then((module) => {
      Loaded = module.default;
    }));

  preloaders.push(preload);

  return function Deferred(props: Props) {
    if (!Loaded) use(preload());
    const Component = Loaded as ComponentType<Props>;

    return <Component {...props} />;
  };
}

export function preloadDeferredComponents() {
  return Promise.all(preloaders.map((preload) => preload()));
}
