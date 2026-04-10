const grafanaUrl = process.env.BITSOCIAL_STATS_GRAFANA_BOOTSTRAP_URL ?? "http://grafana:3000";
const adminUser = process.env.BITSOCIAL_STATS_GRAFANA_ADMIN_USER ?? "bitsocial";
const adminPassword = process.env.BITSOCIAL_STATS_GRAFANA_ADMIN_PASSWORD ?? "bitsocial";

const dashboards = [
  {
    dashboardUid: "bitsocial-stats",
    publicDashboardUid: "bf79ef21-2289-42dd-a409-e8e6d1fdac6f",
    accessToken: "e9277bcc0c421ddcacd29f591466678c",
  },
  {
    dashboardUid: "bitsocial-5chan",
    publicDashboardUid: "decaef09-6d48-4ea0-9e28-1d462aaa17b5",
    accessToken: "fa6f2225e0ea98e116fb6f85d84e0186",
  },
];

const publicDashboardConfig = {
  annotationsEnabled: false,
  isEnabled: true,
  share: "public",
  timeSelectionEnabled: true,
};

const authHeader = `Basic ${Buffer.from(`${adminUser}:${adminPassword}`).toString("base64")}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const request = async (path, options = {}) => {
  const response = await fetch(new URL(path, grafanaUrl), {
    ...options,
    headers: {
      Authorization: authHeader,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  return { data, response };
};

const waitForGrafana = async () => {
  for (let attempt = 1; attempt <= 60; attempt += 1) {
    try {
      const { response } = await request("/api/health");
      if (response.ok) {
        console.log(`Grafana is ready after ${attempt} checks.`);
        return;
      }
    } catch {}

    await sleep(2000);
  }

  throw new Error("Timed out waiting for Grafana to become ready.");
};

const waitForDashboard = async (dashboardUid) => {
  for (let attempt = 1; attempt <= 60; attempt += 1) {
    const { response } = await request(`/api/dashboards/uid/${dashboardUid}`);
    if (response.ok) {
      return;
    }

    if (response.status !== 404) {
      throw new Error(
        `Unexpected response while waiting for dashboard ${dashboardUid}: ${response.status}`,
      );
    }

    await sleep(1000);
  }

  throw new Error(`Timed out waiting for dashboard ${dashboardUid} to be provisioned.`);
};

const ensureSharedDashboard = async ({ accessToken, dashboardUid, publicDashboardUid }) => {
  const desired = {
    accessToken,
    uid: publicDashboardUid,
    ...publicDashboardConfig,
  };

  const existingResult = await request(`/api/dashboards/uid/${dashboardUid}/public-dashboards/`);
  if (existingResult.response.status === 404) {
    const createResult = await request(`/api/dashboards/uid/${dashboardUid}/public-dashboards/`, {
      body: JSON.stringify(desired),
      method: "POST",
    });

    if (!createResult.response.ok) {
      throw new Error(
        `Failed to create shared dashboard for ${dashboardUid}: ${createResult.response.status}`,
      );
    }

    console.log(`Created shared dashboard for ${dashboardUid}.`);
    return;
  }

  if (!existingResult.response.ok) {
    throw new Error(
      `Failed to read shared dashboard for ${dashboardUid}: ${existingResult.response.status}`,
    );
  }

  const existing = existingResult.data;
  const sameIdentity = existing.uid === desired.uid && existing.accessToken === desired.accessToken;

  if (!sameIdentity) {
    const deleteResult = await request(
      `/api/dashboards/uid/${dashboardUid}/public-dashboards/${existing.uid}`,
      { method: "DELETE" },
    );

    if (!deleteResult.response.ok) {
      throw new Error(
        `Failed to replace shared dashboard for ${dashboardUid}: ${deleteResult.response.status}`,
      );
    }

    const createResult = await request(`/api/dashboards/uid/${dashboardUid}/public-dashboards/`, {
      body: JSON.stringify(desired),
      method: "POST",
    });

    if (!createResult.response.ok) {
      throw new Error(
        `Failed to recreate shared dashboard for ${dashboardUid}: ${createResult.response.status}`,
      );
    }

    console.log(`Recreated shared dashboard for ${dashboardUid}.`);
    return;
  }

  const patchResult = await request(
    `/api/dashboards/uid/${dashboardUid}/public-dashboards/${publicDashboardUid}`,
    {
      body: JSON.stringify(publicDashboardConfig),
      method: "PATCH",
    },
  );

  if (!patchResult.response.ok) {
    throw new Error(
      `Failed to update shared dashboard for ${dashboardUid}: ${patchResult.response.status}`,
    );
  }

  console.log(`Updated shared dashboard for ${dashboardUid}.`);
};

await waitForGrafana();

for (const dashboard of dashboards) {
  await waitForDashboard(dashboard.dashboardUid);
  await ensureSharedDashboard(dashboard);
}

console.log("Shared dashboards are ready.");
