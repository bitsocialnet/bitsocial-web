const path = require("node:path");

module.exports = function reactPerfPlugin() {
  return {
    name: "react-performance-collector",
    configureWebpack(config, isServer) {
      const profiling = process.env.REACT_PERF_PROFILE === "1";
      const enabled = !isServer && (process.env.NODE_ENV === "development" || profiling);
      // Docusaurus does not invalidate its filesystem cache when React aliases
      // change. Keep profiling renderer resolutions separate from normal builds.
      const cache =
        config.cache && typeof config.cache === "object"
          ? {
              ...config.cache,
              name: `${config.cache.name}-react-perf-${enabled ? (profiling ? "profiling" : "development") : "disabled"}`,
              version: `${config.cache.version ?? ""}-react-perf-v1`,
              buildDependencies: {
                reactPerfPlugin: [__filename],
              },
            }
          : config.cache;
      const plugins = [
        {
          apply(compiler) {
            new compiler.webpack.DefinePlugin({
              __REACT_PERF_ENABLED__: JSON.stringify(enabled),
            }).apply(compiler);
          },
        },
      ];
      if (!enabled) return { plugins, cache };
      if (typeof config.entry !== "string" && !Array.isArray(config.entry)) {
        throw new Error("React profiling requires a supported Docusaurus client entry.");
      }
      return {
        plugins,
        cache,
        mergeStrategy: {
          entry: "replace",
          ...(profiling ? { "resolve.alias": "replace" } : {}),
        },
        entry: [
          path.resolve(
            __dirname,
            profiling
              ? "../src/clientModules/perf-profiling.js"
              : "../src/clientModules/perf-development.js",
          ),
          ...[config.entry].flat(),
        ],
        ...(profiling
          ? {
              resolve: {
                alias: {
                  // Replace the merged alias table so this exact match precedes
                  // Docusaurus's generic react-dom directory alias.
                  "react-dom/client$": require.resolve("react-dom/profiling"),
                  ...config.resolve?.alias,
                },
              },
              optimization: { minimize: false },
              devtool: "source-map",
            }
          : {}),
      };
    },
  };
};
