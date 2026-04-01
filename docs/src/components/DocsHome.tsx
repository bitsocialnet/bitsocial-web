import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import PagefindSearch from "./PagefindSearch";

function tr(id: string, message: string, description: string) {
  return translate({ id, message, description });
}

const protocolCards = [
  {
    to: "/custom-challenges/",
    eyebrow: tr(
      "docs.home.protocol.card.antiSpam.eyebrow",
      "Anti-spam",
      "Eyebrow label for the custom challenges card on the docs home page.",
    ),
    title: tr(
      "docs.home.protocol.card.antiSpam.title",
      "Custom challenges",
      "Title for the custom challenges card on the docs home page.",
    ),
    body: tr(
      "docs.home.protocol.card.antiSpam.body",
      "Why each community can choose its own anti-spam policy instead of inheriting a global moderation stack.",
      "Description for the custom challenges card on the docs home page.",
    ),
  },
  {
    to: "/local-moderation/",
    eyebrow: tr(
      "docs.home.protocol.card.moderation.eyebrow",
      "Moderation",
      "Eyebrow label for the local moderation card on the docs home page.",
    ),
    title: tr(
      "docs.home.protocol.card.moderation.title",
      "Local moderation",
      "Title for the local moderation card on the docs home page.",
    ),
    body: tr(
      "docs.home.protocol.card.moderation.body",
      'What "no global bans" means in practice, and what still gets moderated locally by communities and apps.',
      "Description for the local moderation card on the docs home page.",
    ),
  },
  {
    to: "/identity-and-ownership/",
    eyebrow: tr(
      "docs.home.protocol.card.ownership.eyebrow",
      "Ownership",
      "Eyebrow label for the identity and ownership card on the docs home page.",
    ),
    title: tr(
      "docs.home.protocol.card.ownership.title",
      "Identity and community ownership",
      "Title for the identity and ownership card on the docs home page.",
    ),
    body: tr(
      "docs.home.protocol.card.ownership.body",
      "How keys, hosting delegation, and replaceable infrastructure fit together without turning service providers into custodians.",
      "Description for the identity and ownership card on the docs home page.",
    ),
  },
] as const;

const roadmapCards = [
  {
    to: "/permissionless-public-rpc/",
    eyebrow: tr("docs.home.roadmap.card.phase2.eyebrow", "Phase 2", "Roadmap card eyebrow."),
    title: tr(
      "docs.home.roadmap.card.phase2.title",
      "Permissionless public RPC",
      "Roadmap card title for permissionless public RPC.",
    ),
    body: tr(
      "docs.home.roadmap.card.phase2.body",
      "A rewritten proposal for multi-user Bitsocial RPC infrastructure using Bitsocial language instead of old plebbit vocabulary.",
      "Roadmap card description for permissionless public RPC.",
    ),
  },
  {
    to: "/bitsocial-network/",
    eyebrow: tr("docs.home.roadmap.card.phase4.eyebrow", "Phase 4", "Roadmap card eyebrow."),
    title: tr(
      "docs.home.roadmap.card.phase4.title",
      "Bitsocial Network",
      "Roadmap card title for Bitsocial Network.",
    ),
    body: tr(
      "docs.home.roadmap.card.phase4.body",
      "The appchain layer proposed to power shared liquidity, decentralized domains, and durable incentives across apps.",
      "Roadmap card description for Bitsocial Network.",
    ),
  },
  {
    to: "/decentralize-all-social-media/",
    eyebrow: tr("docs.home.roadmap.card.phase5.eyebrow", "Phase 5", "Roadmap card eyebrow."),
    title: tr(
      "docs.home.roadmap.card.phase5.title",
      "Decentralize all social media",
      "Roadmap card title for the decentralize all social media page.",
    ),
    body: tr(
      "docs.home.roadmap.card.phase5.body",
      "The end-state: many public RPCs, competing apps, portable identities, and optional feed markets instead of captive platforms.",
      "Roadmap card description for the decentralize all social media page.",
    ),
  },
] as const;

const appCards = [
  {
    to: "/apps/5chan/",
    eyebrow: tr("docs.home.apps.card.5chan.eyebrow", "Imageboard", "Apps card eyebrow for 5chan."),
    title: "5chan",
    body: tr(
      "docs.home.apps.card.5chan.body",
      "A decentralized imageboard where anyone can create and own boards, and multiple boards compete for each directory slot.",
      "Apps card description for 5chan.",
    ),
  },
  {
    to: "/apps/seedit/",
    eyebrow: tr("docs.home.apps.card.seedit.eyebrow", "Forum", "Apps card eyebrow for Seedit."),
    title: "Seedit",
    body: tr(
      "docs.home.apps.card.seedit.body",
      "An old.reddit-style alternative where communities are user-owned and compete for default listing slots.",
      "Apps card description for Seedit.",
    ),
  },
] as const;

const developerToolCards = [
  {
    to: "/developer-tools/react-hooks/",
    eyebrow: "React",
    title: tr(
      "docs.home.devtools.card.reactHooks.title",
      "React Hooks",
      "Developer tools card title for React Hooks.",
    ),
    body: tr(
      "docs.home.devtools.card.reactHooks.body",
      "A hooks API for fetching feeds, comments, profiles, publishing content, and managing accounts - all without a central server.",
      "Developer tools card description for React Hooks.",
    ),
  },
  {
    to: "/developer-tools/cli/",
    eyebrow: "CLI",
    title: tr(
      "docs.home.devtools.card.cli.title",
      "Bitsocial CLI",
      "Developer tools card title for Bitsocial CLI.",
    ),
    body: tr(
      "docs.home.devtools.card.cli.body",
      "Command-line interface for running a P2P node, creating communities, and managing settings.",
      "Developer tools card description for Bitsocial CLI.",
    ),
  },
] as const;

const antiSpamCards = [
  {
    to: "/anti-spam/spam-blocker/",
    eyebrow: tr(
      "docs.home.antispam.card.spamBlocker.eyebrow",
      "Risk scoring",
      "Anti-spam card eyebrow for Spam Blocker.",
    ),
    title: tr(
      "docs.home.antispam.card.spamBlocker.title",
      "Spam Blocker",
      "Anti-spam card title for Spam Blocker.",
    ),
    body: tr(
      "docs.home.antispam.card.spamBlocker.body",
      "A centralized risk-scoring service with OAuth and CAPTCHA challenges, dynamic rate limiting, and a network indexer.",
      "Anti-spam card description for Spam Blocker.",
    ),
  },
  {
    to: "/anti-spam/captcha-canvas-challenge/",
    eyebrow: tr(
      "docs.home.antispam.card.captcha.eyebrow",
      "Image captcha",
      "Anti-spam card eyebrow for Captcha Canvas.",
    ),
    title: tr(
      "docs.home.antispam.card.captcha.title",
      "Captcha Canvas",
      "Anti-spam card title for Captcha Canvas.",
    ),
    body: tr(
      "docs.home.antispam.card.captcha.body",
      "Generates image captchas with configurable characters, dimensions, and colors.",
      "Anti-spam card description for Captcha Canvas.",
    ),
  },
  {
    to: "/anti-spam/voucher-challenge/",
    eyebrow: tr(
      "docs.home.antispam.card.voucher.eyebrow",
      "Invite codes",
      "Anti-spam card eyebrow for Voucher Challenge.",
    ),
    title: tr(
      "docs.home.antispam.card.voucher.title",
      "Voucher Challenge",
      "Anti-spam card title for Voucher Challenge.",
    ),
    body: tr(
      "docs.home.antispam.card.voucher.body",
      "Gate publishing behind unique voucher codes distributed by community owners to trusted users.",
      "Anti-spam card description for Voucher Challenge.",
    ),
  },
  {
    to: "/anti-spam/evm-contract-call/",
    eyebrow: tr(
      "docs.home.antispam.card.evm.eyebrow",
      "On-chain",
      "Anti-spam card eyebrow for EVM Contract Call.",
    ),
    title: tr(
      "docs.home.antispam.card.evm.title",
      "EVM Contract Call",
      "Anti-spam card title for EVM Contract Call.",
    ),
    body: tr(
      "docs.home.antispam.card.evm.body",
      "Verify on-chain conditions - token balances, NFT ownership, or any smart contract state - before allowing a post.",
      "Anti-spam card description for EVM Contract Call.",
    ),
  },
] as const;

const infrastructureCards = [
  {
    to: "/infrastructure/bso-resolver/",
    eyebrow: tr(
      "docs.home.infrastructure.card.bso.eyebrow",
      "Names",
      "Infrastructure card eyebrow for BSO Resolver.",
    ),
    title: tr(
      "docs.home.infrastructure.card.bso.title",
      "BSO Resolver",
      "Infrastructure card title for BSO Resolver.",
    ),
    body: tr(
      "docs.home.infrastructure.card.bso.body",
      "Resolves .bso domain names to public keys via ENS TXT records, with caching for Node and browser.",
      "Infrastructure card description for BSO Resolver.",
    ),
  },
  {
    to: "/infrastructure/mintpass/",
    eyebrow: tr(
      "docs.home.infrastructure.card.mintpass.eyebrow",
      "Identity",
      "Infrastructure card eyebrow for Mintpass.",
    ),
    title: "Mintpass",
    body: tr(
      "docs.home.infrastructure.card.mintpass.body",
      "NFT-based proof-of-personhood via SMS verification, reducing sybil attacks like fake votes and ban evasion.",
      "Infrastructure card description for Mintpass.",
    ),
  },
  {
    to: "/infrastructure/telegram-bots/",
    eyebrow: tr(
      "docs.home.infrastructure.card.telegram.eyebrow",
      "Bots",
      "Infrastructure card eyebrow for Telegram Bots.",
    ),
    title: tr(
      "docs.home.infrastructure.card.telegram.title",
      "Telegram Bots",
      "Infrastructure card title for Telegram Bots.",
    ),
    body: tr(
      "docs.home.infrastructure.card.telegram.body",
      "Feed bots that monitor Bitsocial communities and forward new posts to Telegram channels.",
      "Infrastructure card description for Telegram Bots.",
    ),
  },
] as const;

const contributorCards = [
  {
    to: "/agent-playbooks/",
    eyebrow: tr(
      "docs.home.contributor.card.playbooks.eyebrow",
      "Workflow",
      "Contributor reference card eyebrow for playbooks.",
    ),
    title: tr(
      "docs.home.contributor.card.playbooks.title",
      "Contributor playbooks",
      "Contributor reference card title for playbooks.",
    ),
    body: tr(
      "docs.home.contributor.card.playbooks.body",
      "Hooks setup, bug investigation, translation workflow, long-running agent handoffs, and other repo-specific operating rules.",
      "Contributor reference card description for playbooks.",
    ),
  },
  {
    to: "/agent-playbooks/templates/",
    eyebrow: tr(
      "docs.home.contributor.card.templates.eyebrow",
      "Templates",
      "Contributor reference card eyebrow for templates.",
    ),
    title: tr(
      "docs.home.contributor.card.templates.title",
      "Progress and feature-list templates",
      "Contributor reference card title for templates.",
    ),
    body: tr(
      "docs.home.contributor.card.templates.body",
      "Reference documents for long-running work, including the machine-readable feature list template used by the repo workflow.",
      "Contributor reference card description for templates.",
    ),
  },
] as const;

function CardGrid({
  cards,
}: {
  cards: ReadonlyArray<{ to: string; eyebrow: string; title: string; body: string }>;
}) {
  return (
    <div className="docs-home__grid">
      {cards.map((card) => (
        <Link key={card.to} className="docs-card" to={card.to}>
          <span className="docs-card__eyebrow">{card.eyebrow}</span>
          <strong>{card.title}</strong>
          <span>{card.body}</span>
        </Link>
      ))}
    </div>
  );
}

export default function DocsHome() {
  return (
    <div className="docs-home">
      <section className="docs-home__hero glass-card">
        <p className="docs-kicker">Bitsocial Docs</p>
        <h1>
          {tr(
            "docs.home.hero.heading",
            "Protocol notes, roadmap detail, and contributor playbooks.",
            "Main heading on the docs home hero section.",
          )}
        </h1>
        <p className="docs-home__lede">
          {tr(
            "docs.home.hero.lede",
            "This is the source of truth for the ideas the landing page points at. It starts with the protocol-level concepts Bitsocial is built around, then expands into roadmap proposals and the workflow docs currently used inside this repository.",
            "Lead paragraph on the docs home hero section.",
          )}
        </p>
        <div className="docs-home__actions">
          <Link className="docs-button docs-button--glass" to="/local-moderation/">
            {tr(
              "docs.home.hero.action.localModeration",
              "Local moderation",
              "Primary docs home CTA linking to the local moderation doc.",
            )}
          </Link>
          <Link className="docs-button docs-button--solid" to="/permissionless-public-rpc/">
            {tr(
              "docs.home.hero.action.permissionlessPublicRpc",
              "Permissionless public RPC",
              "Primary docs home CTA linking to the permissionless public RPC doc.",
            )}
          </Link>
          <Link className="docs-button docs-button--ghost" to="/search/">
            {tr(
              "docs.home.hero.action.searchDocs",
              "Search docs",
              "Primary docs home CTA linking to the docs search page.",
            )}
          </Link>
        </div>
      </section>

      <PagefindSearch className="docs-home__search" />

      <section className="docs-home__section">
        <div className="docs-home__section-header">
          <p className="docs-kicker">
            {tr(
              "docs.home.protocol.kicker",
              "Protocol notes",
              "Section kicker for the protocol notes section on the docs home page.",
            )}
          </p>
          <h2>
            {tr(
              "docs.home.protocol.heading",
              "Explain the core claims from the front page.",
              "Section heading for the protocol notes section on the docs home page.",
            )}
          </h2>
          <p>
            {tr(
              "docs.home.protocol.body",
              "These pages replace the old single-page notes view with separate routes, so the landing page can link directly to the idea it is talking about.",
              "Section description for the protocol notes section on the docs home page.",
            )}
          </p>
        </div>
        <CardGrid cards={protocolCards} />
      </section>

      <section className="docs-home__section">
        <div className="docs-home__section-header">
          <p className="docs-kicker">
            {tr(
              "docs.home.roadmap.kicker",
              "Roadmap detail",
              "Section kicker for the roadmap section.",
            )}
          </p>
          <h2>
            {tr(
              "docs.home.roadmap.heading",
              "Expand the master plan into pages people can actually read.",
              "Section heading for the roadmap section on the docs home page.",
            )}
          </h2>
          <p>
            {tr(
              "docs.home.roadmap.body",
              "The roadmap cards on the landing page now have destination pages instead of generic docs links or an outdated GitHub issue.",
              "Section description for the roadmap section on the docs home page.",
            )}
          </p>
        </div>
        <CardGrid cards={roadmapCards} />
      </section>

      <section className="docs-home__section">
        <div className="docs-home__section-header">
          <p className="docs-kicker">
            {tr(
              "docs.home.apps.kicker",
              "Apps",
              "Section kicker for the apps section on the docs home page.",
            )}
          </p>
          <h2>
            {tr(
              "docs.home.apps.heading",
              "Clients built on the Bitsocial protocol.",
              "Section heading for the apps section on the docs home page.",
            )}
          </h2>
          <p>
            {tr(
              "docs.home.apps.body",
              "Each app provides a different interface to the same decentralized network. Communities and content are interoperable across all of them.",
              "Section description for the apps section on the docs home page.",
            )}
          </p>
        </div>
        <CardGrid cards={appCards} />
      </section>

      <section className="docs-home__section">
        <div className="docs-home__section-header">
          <p className="docs-kicker">
            {tr(
              "docs.home.devtools.kicker",
              "Developer tools",
              "Section kicker for the developer tools section on the docs home page.",
            )}
          </p>
          <h2>
            {tr(
              "docs.home.devtools.heading",
              "Build on the protocol with hooks and CLI tooling.",
              "Section heading for the developer tools section on the docs home page.",
            )}
          </h2>
          <p>
            {tr(
              "docs.home.devtools.body",
              "Libraries and tools for developers building Bitsocial clients, bots, or community management workflows.",
              "Section description for the developer tools section on the docs home page.",
            )}
          </p>
        </div>
        <CardGrid cards={developerToolCards} />
      </section>

      <section className="docs-home__section">
        <div className="docs-home__section-header">
          <p className="docs-kicker">
            {tr(
              "docs.home.antispam.kicker",
              "Anti-spam challenges",
              "Section kicker for the anti-spam challenges section on the docs home page.",
            )}
          </p>
          <h2>
            {tr(
              "docs.home.antispam.heading",
              "Modular challenges communities can mix and match.",
              "Section heading for the anti-spam challenges section on the docs home page.",
            )}
          </h2>
          <p>
            {tr(
              "docs.home.antispam.body",
              "Each challenge type is a standalone package that communities can enable, configure, and combine to fit their moderation needs.",
              "Section description for the anti-spam challenges section on the docs home page.",
            )}
          </p>
        </div>
        <CardGrid cards={antiSpamCards} />
      </section>

      <section className="docs-home__section">
        <div className="docs-home__section-header">
          <p className="docs-kicker">
            {tr(
              "docs.home.infrastructure.kicker",
              "Infrastructure",
              "Section kicker for the infrastructure section on the docs home page.",
            )}
          </p>
          <h2>
            {tr(
              "docs.home.infrastructure.heading",
              "Supporting services and protocol-level tooling.",
              "Section heading for the infrastructure section on the docs home page.",
            )}
          </h2>
          <p>
            {tr(
              "docs.home.infrastructure.body",
              "Name resolution, identity verification, and cross-platform integrations that underpin the Bitsocial ecosystem.",
              "Section description for the infrastructure section on the docs home page.",
            )}
          </p>
        </div>
        <CardGrid cards={infrastructureCards} />
      </section>

      <section className="docs-home__section">
        <div className="docs-home__section-header">
          <p className="docs-kicker">
            {tr(
              "docs.home.contributor.kicker",
              "Contributor reference",
              "Section kicker for the contributor reference section on the docs home page.",
            )}
          </p>
          <h2>
            {tr(
              "docs.home.contributor.heading",
              "Keep the repo workflow docs visible instead of hiding them in a raw markdown folder.",
              "Section heading for the contributor reference section on the docs home page.",
            )}
          </h2>
          <p>
            {tr(
              "docs.home.contributor.body.prefix",
              "The existing docs under",
              "Prefix text for the contributor reference section description.",
            )}{" "}
            <code>/docs/agent-playbooks</code>{" "}
            {tr(
              "docs.home.contributor.body.suffix",
              "are preserved and published here for transparency. They are primarily contributor-facing, but they now live inside the docs UI like the public-facing pages do.",
              "Suffix text for the contributor reference section description.",
            )}
          </p>
        </div>
        <CardGrid cards={contributorCards} />
      </section>
    </div>
  );
}
