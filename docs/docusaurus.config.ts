import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import {
  DEFAULT_LANGUAGE_CODE,
  SUPPORTED_LANGUAGES,
  SUPPORTED_LANGUAGE_CODES,
} from "./src/lib/locales";

const repoEditUrl = "https://github.com/bitsocialnet/bitsocial-web/tree/master";
const showDocsGitMetadata = process.env.VERCEL !== "1";

/** Docs live under /docs/; logo + title must link to the main site root, not useBaseUrl("/"). */
const mainSiteOrigin = "https://bitsocial.net";
const localeConfigs = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((language) => [
    language.code,
    {
      label: language.label,
      htmlLang: language.code,
      direction: language.dir === "rtl" ? ("rtl" as const) : ("ltr" as const),
      translate: language.code === DEFAULT_LANGUAGE_CODE,
    },
  ]),
);

const config: Config = {
  title: "Bitsocial Docs",
  tagline: "Protocol notes, roadmap, and contributor playbooks",
  favicon: "favicon.ico",
  future: {
    v4: true,
  },
  url: mainSiteOrigin,
  baseUrl: "/docs/",
  onBrokenLinks: "throw",
  trailingSlash: true,
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },
  themes: ["@docusaurus/theme-mermaid"],
  i18n: {
    defaultLocale: "en",
    locales: [...SUPPORTED_LANGUAGE_CODES],
    localeConfigs,
  },
  stylesheets: [
    {
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Exo:wght@400;500;600;700;800;900&display=swap",
      type: "text/css",
    },
  ],
  clientModules: ["./src/clientModules/reactGrab.js"],
  presets: [
    [
      "classic",
      {
        docs: {
          path: ".",
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          editUrl: repoEditUrl,
          breadcrumbs: false,
          showLastUpdateTime: showDocsGitMetadata,
          showLastUpdateAuthor: false,
          exclude: [
            ".docusaurus/**",
            "build/**",
            "dist/**",
            "i18n/**",
            "node_modules/**",
            "src/**",
            "static/**",
            "agent-runs/**",
            "AGENTS.md",
            "README.md",
            "**/*.template.json",
          ],
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Bitsocial",
      logo: {
        alt: "Bitsocial logo",
        src: "img/logo.png",
        href: `${mainSiteOrigin}/`,
      },
      items: [
        {
          to: "/",
          label: "Overview",
          position: "left",
          activeBaseRegex: "^/docs/$",
        },
        { to: "/search/", label: "Search", position: "left" },
        { to: "/agent-playbooks/", label: "Contributor", position: "left" },
        {
          type: "localeDropdown",
          position: "right",
        },
        {
          href: "https://github.com/bitsocialnet",
          label: "GitHub",
          position: "right",
          className: "header-github-link navbar__link--no-external-icon",
          "aria-label": "GitHub organization",
        },
      ],
    },
    footer: {
      links: [
        {
          title: "Protocol",
          items: [
            { label: "Peer-to-peer protocol", to: "/peer-to-peer-protocol/" },
            { label: "Custom challenges", to: "/custom-challenges/" },
            { label: "Local moderation", to: "/local-moderation/" },
            { label: "Identity and ownership", to: "/identity-and-ownership/" },
          ],
        },
        {
          title: "Roadmap",
          items: [
            { label: "Permissionless public RPC", to: "/permissionless-public-rpc/" },
            { label: "Bitsocial Network", to: "/bitsocial-network/" },
            {
              label: "Decentralize all social media",
              to: "/decentralize-all-social-media/",
            },
          ],
        },
        {
          title: "Apps & Tools",
          items: [
            { label: "5chan", to: "/apps/5chan/" },
            { label: "Seedit", to: "/apps/seedit/" },
            { label: "React Hooks", to: "/developer-tools/react-hooks/" },
            { label: "CLI", to: "/developer-tools/cli/" },
          ],
        },
        {
          title: "Project",
          items: [
            { label: "Main site", href: "https://bitsocial.net" },
            { label: "GitHub", href: "https://github.com/bitsocialnet/bitsocial-web" },
          ],
        },
      ],
      copyright: `Decentralize All Social Media · © ${new Date().getFullYear()} Bitsocial Forge, Inc.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.oneDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
