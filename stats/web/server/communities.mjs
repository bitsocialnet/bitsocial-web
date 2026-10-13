import fs from "node:fs";

// Reads the community lists the monitor watches (the snapshots written by
// `yarn build:stats-dashboards`), so the dashboard can name and order every community even
// before Prometheus has data for it.
export const loadCommunityLists = (monitoringClients, readFile = fs.readFileSync) =>
  Object.fromEntries(
    monitoringClients.map((client) => {
      const communities = [];
      for (const source of client.sources || []) {
        if (/^https?:/.test(source)) {
          throw new Error(
            `client '${client.id}' uses a remote source, which the dashboard cannot read`,
          );
        }
        const directoryList = JSON.parse(readFile(source, "utf8"));
        for (const directory of directoryList.directories || []) {
          const address = directory.communityAddress || directory.name;
          if (typeof address !== "string") {
            continue;
          }
          communities.push({
            address,
            title: typeof directory.title === "string" ? directory.title : undefined,
            directoryCode:
              typeof directory.directoryCode === "string" ? directory.directoryCode : undefined,
            nsfw: directory.features?.safeForWork === false || undefined,
          });
        }
      }
      return [client.id, communities];
    }),
  );
