const newsletterSubscribeUrl = import.meta.env.VITE_NEWSLETTER_SUBSCRIBE_URL?.trim() ?? "";

const newsletterListUuids =
  import.meta.env.VITE_NEWSLETTER_LIST_UUIDS?.split(",")
    .map((value) => value.trim())
    .filter(Boolean) ?? [];

export const newsletterRequiresConfirmation =
  import.meta.env.VITE_NEWSLETTER_CONFIRMATION_REQUIRED === "true";

export const newsletterSubscribeAction = newsletterSubscribeUrl;
export const configuredNewsletterListUuids = newsletterListUuids;
export const isNewsletterConfigured =
  newsletterSubscribeUrl.length > 0 && newsletterListUuids.length > 0;

export class NewsletterConfigurationError extends Error {
  constructor() {
    super("Newsletter signup is not configured.");
    this.name = "NewsletterConfigurationError";
  }
}

type ListmonkSubscribeResponse = {
  data?: boolean;
  message?: string;
};

async function parseSubscribeResponse(
  response: Response,
): Promise<ListmonkSubscribeResponse | null> {
  try {
    return (await response.json()) as ListmonkSubscribeResponse;
  } catch {
    return null;
  }
}

type NewsletterSubscribeOptions = {
  locale?: string | null;
};

export async function subscribeToNewsletter(
  email: string,
  options: NewsletterSubscribeOptions = {},
) {
  if (!isNewsletterConfigured) {
    throw new NewsletterConfigurationError();
  }

  const normalizedLocale = options.locale?.trim();

  const response = await fetch(newsletterSubscribeUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      list_uuids: newsletterListUuids,
      ...(normalizedLocale
        ? {
            lang: normalizedLocale,
            locale: normalizedLocale,
          }
        : {}),
    }),
  });

  const payload = await parseSubscribeResponse(response);

  if (!response.ok || payload?.data === false) {
    throw new Error(payload?.message ?? "Newsletter signup failed.");
  }
}
