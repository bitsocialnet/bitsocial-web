export type TweenLike = {
  kill: () => void;
  paused?: (value: boolean) => void;
};

export async function loadGsap() {
  if (typeof window === "undefined") {
    return null;
  }

  const module = await import("gsap");
  return module.default ?? module.gsap ?? module;
}
