import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getScrollBehavior(): ScrollBehavior {
  return document.documentElement.dataset.reducedMotion === "true" ? "auto" : "smooth";
}
