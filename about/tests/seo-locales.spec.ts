import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { createInstance } from "i18next";
import { SUPPORTED_LANGUAGE_CODES } from "../src/lib/locales";
import {
  getSeoMetadata,
  getStaticSeoRoutes,
  renderSeoHead,
  renderSitemapXml,
} from "../src/lib/seo";

async function createLocaleT(language: string) {
  const resources = JSON.parse(
    readFileSync(
      new URL(`../public/translations/${language}/default.json`, import.meta.url),
      "utf8",
    ),
  );
  const instance = createInstance();
  await instance.init({
    lng: language,
    showSupportNotice: false,
    resources: { [language]: { translation: resources } },
    interpolation: { escapeValue: false },
  });
  return instance.t;
}

test.describe("localized SEO metadata", () => {
  test.beforeEach(({ browserName }) => {
    test.skip(browserName !== "chromium", "one project is enough for this module test");
  });

  test("makes each language URL self-canonical and indexable", () => {
    const italian = getSeoMetadata("/projects", "?lang=it");
    expect(italian.canonicalUrl).toBe("https://bitsocial.net/projects?lang=it");
    expect(italian.robots.startsWith("index")).toBe(true);

    const english = getSeoMetadata("/projects", "?lang=en");
    expect(english.canonicalUrl).toBe("https://bitsocial.net/projects");
    expect(getSeoMetadata("/projects").canonicalUrl).toBe("https://bitsocial.net/projects");
  });

  test("lists every language plus x-default as hreflang alternates", () => {
    const { alternates } = getSeoMetadata("/", "?lang=de");
    const hrefByLang = new Map(alternates.map((alternate) => [alternate.hreflang, alternate.href]));

    expect(alternates).toHaveLength(SUPPORTED_LANGUAGE_CODES.length + 1);
    expect(hrefByLang.get("x-default")).toBe("https://bitsocial.net/");
    expect(hrefByLang.get("en")).toBe("https://bitsocial.net/");
    expect(hrefByLang.get("it")).toBe("https://bitsocial.net/?lang=it");
    expect(hrefByLang.get("tl")).toBe("https://bitsocial.net/?lang=fil");
    expect(hrefByLang.has("fil")).toBe(false);
  });

  test("keeps filtered and unknown-language URLs out of the index", () => {
    const filtered = getSeoMetadata("/projects", "?lang=it&category=apps");
    expect(filtered.robots.startsWith("noindex")).toBe(true);
    expect(filtered.alternates).toEqual([]);
    expect(filtered.canonicalUrl).toBe("https://bitsocial.net/projects?lang=it");

    const unknownLanguage = getSeoMetadata("/", "?lang=xx");
    expect(unknownLanguage.robots.startsWith("noindex")).toBe(true);
    expect(unknownLanguage.canonicalUrl).toBe("https://bitsocial.net/");
  });

  test("translates titles and descriptions with the rendered locale", async () => {
    const italianT = await createLocaleT("it");
    const englishHome = getSeoMetadata("/");
    const italianHome = getSeoMetadata("/", "?lang=it", italianT);

    expect(italianHome.title).toBe(italianT("seo.home.title"));
    expect(italianHome.title).not.toBe(englishHome.title);
    expect(italianHome.description).not.toBe(englishHome.description);

    const appTitle = getSeoMetadata("/projects/challenge-composer", "?lang=it", italianT).title;
    expect(appTitle).toContain("Challenge Composer");
    expect(appTitle).not.toContain("{{name}}");

    const appDescription = getSeoMetadata("/projects/challenge-composer", "", italianT).description;
    expect(appDescription).not.toMatch(/<[^>]+>/);
  });

  test("renders hreflang links in the head and language URLs in the sitemap", () => {
    const head = renderSeoHead(getSeoMetadata("/about", "?lang=ja"));
    expect(head).toContain(
      '<link data-seo-managed="canonical" rel="canonical" href="https://bitsocial.net/about?lang=ja" />',
    );
    expect(head).toContain(
      'rel="alternate" hreflang="x-default" href="https://bitsocial.net/about"',
    );

    const sitemap = renderSitemapXml(getStaticSeoRoutes());
    expect(sitemap).toContain("<loc>https://bitsocial.net/</loc>");
    expect(sitemap).toContain("<loc>https://bitsocial.net/?lang=it</loc>");
    expect(sitemap).toContain("<loc>https://bitsocial.net/projects/5chan?lang=zh</loc>");
    expect(sitemap).not.toContain("?lang=en");
  });
});
