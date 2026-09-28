// Docusaurus also evaluates client modules during static generation.
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  const hideToolbar =
    window.__VISUAL_TESTING__ || window.__NO_DEV_TOOLBAR__ || window.__PROFILING__;
  if (!hideToolbar) {
    Promise.all([import("agentation"), import("react"), import("react-dom/client")])
      .then(([{ Agentation }, { createElement }, { createRoot }]) => {
        if (document.getElementById("agentation-root")) return;
        const host = document.createElement("div");
        host.id = "agentation-root";
        document.body.append(host);
        createRoot(host).render(createElement(Agentation));
      })
      .catch((error) => console.error("Failed to load Agentation:", error));
  }
}
