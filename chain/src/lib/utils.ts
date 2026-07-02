export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function getScrollBehavior(): ScrollBehavior {
  return document.documentElement.dataset.reducedMotion === "true" ? "auto" : "smooth";
}
