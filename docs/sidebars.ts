import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docsSidebar: [
    "index",
    "search",
    {
      type: "category",
      label: "Protocol notes",
      items: ["custom-challenges", "local-moderation", "identity-and-ownership"],
    },
    {
      type: "category",
      label: "Master plan",
      items: ["permissionless-public-rpc", "bitsocial-network", "decentralize-all-social-media"],
    },
    {
      type: "category",
      label: "Apps",
      items: ["apps/5chan", "apps/seedit"],
    },
    {
      type: "category",
      label: "Developer tools",
      items: ["developer-tools/react-hooks", "developer-tools/cli"],
    },
    {
      type: "category",
      label: "Anti-spam challenges",
      items: [
        "custom-challenges",
        "anti-spam/spam-blocker",
        "anti-spam/captcha-canvas-challenge",
        "anti-spam/voucher-challenge",
        "anti-spam/evm-contract-call",
      ],
    },
    {
      type: "category",
      label: "Infrastructure",
      items: [
        "infrastructure/bso-resolver",
        "infrastructure/mintpass",
        "infrastructure/telegram-bots",
      ],
    },
    {
      type: "category",
      label: "Contributor playbooks",
      link: {
        type: "generated-index",
        slug: "/agent-playbooks/",
        title: "Contributor playbooks",
        description: "Repo workflow documents surfaced inside the public docs UI.",
      },
      items: [
        "agent-playbooks/hooks-setup",
        "agent-playbooks/skills-and-tools",
        "agent-playbooks/bug-investigation",
        "agent-playbooks/translations",
        "agent-playbooks/commit-issue-format",
        "agent-playbooks/long-running-agent-workflow",
        "agent-playbooks/known-surprises",
        {
          type: "category",
          label: "Templates",
          link: {
            type: "generated-index",
            slug: "/agent-playbooks/templates/",
            title: "Templates",
            description: "Reference templates used by the long-running workflow.",
          },
          items: [
            "agent-playbooks/templates/progress.template",
            "agent-playbooks/templates/feature-list-template",
          ],
        },
      ],
    },
  ],
};

export default sidebars;
