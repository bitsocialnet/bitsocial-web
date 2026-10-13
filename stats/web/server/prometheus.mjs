// Minimal Prometheus HTTP API client. Queries go out as POST forms so long label regexes never hit
// URL length limits.
export const createPrometheusClient = ({ baseUrl, fetchImpl = fetch, timeoutMs = 20_000 }) => {
  const request = async (apiPath, params) => {
    const response = await fetchImpl(new URL(apiPath, baseUrl), {
      method: "POST",
      body: new URLSearchParams(params),
      signal: AbortSignal.timeout(timeoutMs),
    });
    const body = await response.json().catch(() => null);
    if (!response.ok || body?.status !== "success") {
      throw new Error(
        `Prometheus ${apiPath} answered ${response.status}: ${body?.error || response.statusText}`,
      );
    }
    return body.data.result;
  };

  return {
    instant: (query, time) => request("/api/v1/query", { query, time: String(time) }),
    range: (query, { start, end, step }) =>
      request("/api/v1/query_range", {
        query,
        start: String(start),
        end: String(end),
        step: String(step),
      }),
  };
};
