const INITIAL_SCROLL_SETTLE_MS = 350;
const INITIAL_SCROLL_FRAME_PASSES = 3;

function scrollToTopInstant() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

export function normalizeInitialHomeScrollPosition() {
  const html = document.documentElement;
  const body = document.body;
  const previousHtmlOverflowAnchor = html.style.overflowAnchor;
  const previousBodyOverflowAnchor = body.style.overflowAnchor;
  const previousScrollRestoration =
    "scrollRestoration" in window.history ? window.history.scrollRestoration : null;

  const frameIds: number[] = [];
  const timeoutIds: number[] = [];
  let isActive = true;
  let didRestoreBrowserDefaults = false;

  const restoreBrowserDefaults = () => {
    if (didRestoreBrowserDefaults) return;
    didRestoreBrowserDefaults = true;
    html.style.overflowAnchor = previousHtmlOverflowAnchor;
    body.style.overflowAnchor = previousBodyOverflowAnchor;
    if (previousScrollRestoration !== null) {
      window.history.scrollRestoration = previousScrollRestoration;
    }
  };

  const forceTop = () => {
    if (!isActive) return;
    scrollToTopInstant();
  };

  const scheduleFramePasses = (count: number) => {
    let remaining = count;
    const tick = () => {
      forceTop();
      remaining -= 1;
      if (remaining > 0) {
        frameIds.push(window.requestAnimationFrame(tick));
      }
    };
    frameIds.push(window.requestAnimationFrame(tick));
  };

  // Android Chrome can slightly restore or anchor scroll during first paint and font swap.
  if (previousScrollRestoration !== null) {
    window.history.scrollRestoration = "manual";
  }
  html.style.overflowAnchor = "none";
  body.style.overflowAnchor = "none";

  const handlePageShow = () => {
    forceTop();
    scheduleFramePasses(2);
  };

  const disarm = () => {
    isActive = false;
    frameIds.forEach(window.cancelAnimationFrame);
    timeoutIds.forEach(window.clearTimeout);
    window.removeEventListener("pageshow", handlePageShow);
    restoreBrowserDefaults();
  };

  forceTop();
  scheduleFramePasses(INITIAL_SCROLL_FRAME_PASSES);

  // Past the settle window the reader owns the scroll position: a late `load` (its `pageshow`),
  // font swap or back-forward cache restore must not pull them back to the top.
  timeoutIds.push(
    window.setTimeout(() => {
      forceTop();
      disarm();
    }, INITIAL_SCROLL_SETTLE_MS),
  );

  window.addEventListener("pageshow", handlePageShow);

  if ("fonts" in document) {
    void document.fonts.ready.then(() => {
      if (!isActive) return;
      forceTop();
    });
  }

  return disarm;
}
