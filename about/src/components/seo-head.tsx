import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { getSeoMetadata, serializeStructuredData } from "@/lib/seo";

type SupportedHeadElement = HTMLMetaElement | HTMLLinkElement | HTMLScriptElement;

function upsertHeadElement<T extends SupportedHeadElement>(
  selector: string,
  tagName: "meta" | "link" | "script",
  attributes: Record<string, string>,
): T {
  const existingElement = document.head.querySelector<T>(selector);
  const element = existingElement ?? (document.createElement(tagName) as T);

  Object.entries(attributes).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });

  if (!existingElement) {
    document.head.append(element);
  }

  return element;
}

export default function SeoHead() {
  const location = useLocation();

  useLayoutEffect(() => {
    const seo = getSeoMetadata(location.pathname, location.search);

    document.title = seo.title;

    upsertHeadElement<HTMLMetaElement>('meta[data-seo-managed="description"]', "meta", {
      "data-seo-managed": "description",
      name: "description",
      content: seo.description,
    });
    upsertHeadElement<HTMLMetaElement>('meta[data-seo-managed="robots"]', "meta", {
      "data-seo-managed": "robots",
      name: "robots",
      content: seo.robots,
    });
    upsertHeadElement<HTMLLinkElement>('link[data-seo-managed="canonical"]', "link", {
      "data-seo-managed": "canonical",
      rel: "canonical",
      href: seo.canonicalUrl,
    });
    upsertHeadElement<HTMLMetaElement>('meta[data-seo-managed="og:type"]', "meta", {
      "data-seo-managed": "og:type",
      property: "og:type",
      content: seo.ogType,
    });
    upsertHeadElement<HTMLMetaElement>('meta[data-seo-managed="og:site_name"]', "meta", {
      "data-seo-managed": "og:site_name",
      property: "og:site_name",
      content: "Bitsocial",
    });
    upsertHeadElement<HTMLMetaElement>('meta[data-seo-managed="og:title"]', "meta", {
      "data-seo-managed": "og:title",
      property: "og:title",
      content: seo.title,
    });
    upsertHeadElement<HTMLMetaElement>('meta[data-seo-managed="og:description"]', "meta", {
      "data-seo-managed": "og:description",
      property: "og:description",
      content: seo.description,
    });
    upsertHeadElement<HTMLMetaElement>('meta[data-seo-managed="og:url"]', "meta", {
      "data-seo-managed": "og:url",
      property: "og:url",
      content: seo.canonicalUrl,
    });
    upsertHeadElement<HTMLMetaElement>('meta[data-seo-managed="og:image"]', "meta", {
      "data-seo-managed": "og:image",
      property: "og:image",
      content: seo.imageUrl,
    });
    upsertHeadElement<HTMLMetaElement>('meta[data-seo-managed="og:image:alt"]', "meta", {
      "data-seo-managed": "og:image:alt",
      property: "og:image:alt",
      content: seo.imageAlt,
    });
    upsertHeadElement<HTMLMetaElement>('meta[data-seo-managed="twitter:card"]', "meta", {
      "data-seo-managed": "twitter:card",
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertHeadElement<HTMLMetaElement>('meta[data-seo-managed="twitter:site"]', "meta", {
      "data-seo-managed": "twitter:site",
      name: "twitter:site",
      content: "@bitsocialnet",
    });
    upsertHeadElement<HTMLMetaElement>('meta[data-seo-managed="twitter:title"]', "meta", {
      "data-seo-managed": "twitter:title",
      name: "twitter:title",
      content: seo.title,
    });
    upsertHeadElement<HTMLMetaElement>('meta[data-seo-managed="twitter:description"]', "meta", {
      "data-seo-managed": "twitter:description",
      name: "twitter:description",
      content: seo.description,
    });
    upsertHeadElement<HTMLMetaElement>('meta[data-seo-managed="twitter:image"]', "meta", {
      "data-seo-managed": "twitter:image",
      name: "twitter:image",
      content: seo.imageUrl,
    });
    upsertHeadElement<HTMLMetaElement>('meta[data-seo-managed="twitter:image:alt"]', "meta", {
      "data-seo-managed": "twitter:image:alt",
      name: "twitter:image:alt",
      content: seo.imageAlt,
    });

    const structuredDataScript = upsertHeadElement<HTMLScriptElement>(
      'script[data-seo-managed="structured-data"]',
      "script",
      {
        "data-seo-managed": "structured-data",
        type: "application/ld+json",
      },
    );
    structuredDataScript.textContent = serializeStructuredData(seo.structuredData);
  }, [location.pathname, location.search]);

  return null;
}
