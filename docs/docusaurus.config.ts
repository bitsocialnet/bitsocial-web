import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const repoEditUrl = "https://github.com/bitsocialnet/bitsocial-web/tree/master";
const showDocsGitMetadata = process.env.VERCEL !== "1";

const config: Config = {
  title: "Bitsocial Docs",
  tagline: "Protocol notes, roadmap, and contributor playbooks",
  favicon: "favicon.ico",
  future: {
    v4: true,
  },
  url: "https://bitsocial.net",
  baseUrl: "/docs/",
  onBrokenLinks: "throw",
  trailingSlash: true,
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
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
            "node_modules/**",
            "src/**",
            "static/**",
            "agent-runs/**",
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
        href: "/",
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
          href: "https://bitsocial.net",
          label: "Main site",
          position: "right",
          className: "navbar__link--no-external-icon",
        },
        {
          href: "https://github.com/bitsocialnet",
          label: "GitHub",
          position: "right",
          className: "navbar__link--no-external-icon",
        },
      ],
    },
    footer: {
      links: [
        {
          title: "Protocol",
          items: [
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
