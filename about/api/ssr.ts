interface RequestLike {
  url?: string;
  headers: Record<string, string | string[] | undefined>;
}

interface ResponseLike {
  status(statusCode: number): ResponseLike;
  setHeader(name: string, value: string): void;
  send(body: string): void;
}

interface RenderedResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

export default async function handler(request: RequestLike, response: ResponseLike) {
  const serverEntryUrl = new URL("../../dist/server/entry-server.js", import.meta.url).href;
  const serverEntry = (await import(serverEntryUrl)) as {
    renderAboutRequest: (request: RequestLike) => Promise<RenderedResponse>;
  };
  const rendered = await serverEntry.renderAboutRequest({
    url: request.url ?? "/",
    headers: request.headers,
  });

  response.status(rendered.status);

  for (const [headerName, headerValue] of Object.entries(rendered.headers)) {
    response.setHeader(headerName, headerValue);
  }

  response.send(rendered.body);
}
