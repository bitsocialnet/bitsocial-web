import React, { type ReactNode } from "react";
import Head from "@docusaurus/Head";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import DocItemMetadata from "@theme-original/DocItem/Metadata";

type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

const publisher = {
  "@type": "Organization",
  name: "Bitsocial Forge, Inc.",
  url: "https://bitsocialforge.com/",
  sameAs: ["https://github.com/bitsocialnet"],
};

function getCanonicalUrl(siteUrl: string, permalink: string, trailingSlash: boolean | undefined) {
  const url = new URL(permalink, siteUrl);
  const pathnameLeaf = url.pathname.substring(url.pathname.lastIndexOf("/") + 1);

  if (trailingSlash === true && !url.pathname.endsWith("/") && !pathnameLeaf.includes(".")) {
    url.pathname = `${url.pathname}/`;
  }

  return url.href;
}

function getIsoDate(timestamp: number | null | undefined) {
  return typeof timestamp === "number" ? new Date(timestamp).toISOString() : undefined;
}

function getKeywordList(frontMatterKeywords: unknown, tagLabels: string[]) {
  const keywords = new Set<string>();

  if (typeof frontMatterKeywords === "string") {
    frontMatterKeywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean)
      .forEach((keyword) => keywords.add(keyword));
  }

  if (Array.isArray(frontMatterKeywords)) {
    frontMatterKeywords
      .filter((keyword): keyword is string => typeof keyword === "string")
      .map((keyword) => keyword.trim())
      .filter(Boolean)
      .forEach((keyword) => keywords.add(keyword));
  }

  tagLabels.forEach((tagLabel) => keywords.add(tagLabel));

  return [...keywords];
}

function serializeJsonLd(value: JsonLdValue) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export default function BitsocialDocItemMetadata(): ReactNode {
  const { metadata, frontMatter } = useDoc();
  const {
    i18n: { currentLocale },
    siteConfig,
  } = useDocusaurusContext();

  const canonicalUrl = getCanonicalUrl(
    siteConfig.url,
    metadata.permalink,
    siteConfig.trailingSlash,
  );
  const keywords = getKeywordList(
    frontMatter.keywords,
    metadata.tags.map((tag) => tag.label),
  );
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: metadata.title,
    description: metadata.description || undefined,
    url: canonicalUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Bitsocial",
      url: "https://bitsocial.net/",
    },
    publisher,
    author: publisher,
    dateModified: getIsoDate(metadata.lastUpdatedAt),
    inLanguage: currentLocale,
    keywords: keywords.length > 0 ? keywords.join(", ") : undefined,
  };

  return (
    <>
      <DocItemMetadata />
      <Head>
        <script type="application/ld+json">{serializeJsonLd(structuredData)}</script>
      </Head>
    </>
  );
}
