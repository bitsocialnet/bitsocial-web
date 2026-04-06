// Enable React Grab for true dev builds and local static docs previews.
if (typeof window !== "undefined") {
  const { hostname } = window.location;
  const isLocalPreviewHost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]" ||
    hostname.endsWith(".localhost");

  if (process.env.NODE_ENV === "development" || isLocalPreviewHost) {
    import("react-grab");
  }
}
