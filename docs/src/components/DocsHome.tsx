import Link from "@docusaurus/Link";
import PagefindSearch from "./PagefindSearch";

export default function DocsHome() {
  return (
    <div className="docs-home">
      <section className="docs-home__hero glass-card">
        <p className="docs-kicker">Bitsocial Docs</p>
        <h1>Protocol notes, roadmap detail, and contributor playbooks.</h1>
        <p className="docs-home__lede">
          This is the source of truth for the ideas the landing page points at. It starts with the
          protocol-level concepts Bitsocial is built around, then expands into roadmap proposals and
          the workflow docs currently used inside this repository.
        </p>
        <div className="docs-home__actions">
          <Link className="docs-button docs-button--glass" to="/local-moderation/">
            Local moderation
          </Link>
          <Link className="docs-button docs-button--solid" to="/permissionless-public-rpc/">
            Permissionless public RPC
          </Link>
          <Link className="docs-button docs-button--ghost" to="/search/">
            Search docs
          </Link>
        </div>
      </section>

      <PagefindSearch className="docs-home__search" />

      <section className="docs-home__section">
        <div className="docs-home__section-header">
          <p className="docs-kicker">Protocol notes</p>
          <h2>Explain the core claims from the front page.</h2>
          <p>
            These pages replace the old single-page notes view with separate routes, so the landing
            page can link directly to the idea it is talking about.
          </p>
        </div>
        <div className="docs-home__grid">
          <Link className="docs-card" to="/custom-challenges/">
            <span className="docs-card__eyebrow">Anti-spam</span>
            <strong>Custom challenges</strong>
            <span>
              Why each community can choose its own anti-spam policy instead of inheriting a global
              moderation stack.
            </span>
          </Link>
          <Link className="docs-card" to="/local-moderation/">
            <span className="docs-card__eyebrow">Moderation</span>
            <strong>Local moderation</strong>
            <span>
              What “no global bans” means in practice, and what still gets moderated locally by
              communities and apps.
            </span>
          </Link>
          <Link className="docs-card" to="/identity-and-ownership/">
            <span className="docs-card__eyebrow">Ownership</span>
            <strong>Identity and community ownership</strong>
            <span>
              How keys, hosting delegation, and replaceable infrastructure fit together without
              turning service providers into custodians.
            </span>
          </Link>
        </div>
      </section>

      <section className="docs-home__section">
        <div className="docs-home__section-header">
          <p className="docs-kicker">Roadmap detail</p>
          <h2>Expand the master plan into pages people can actually read.</h2>
          <p>
            The roadmap cards on the landing page now have destination pages instead of generic docs
            links or an outdated GitHub issue.
          </p>
        </div>
        <div className="docs-home__grid">
          <Link className="docs-card" to="/permissionless-public-rpc/">
            <span className="docs-card__eyebrow">Phase 2</span>
            <strong>Permissionless public RPC</strong>
            <span>
              A rewritten proposal for multi-user Bitsocial RPC infrastructure using Bitsocial
              language instead of old plebbit vocabulary.
            </span>
          </Link>
          <Link className="docs-card" to="/bitsocial-network/">
            <span className="docs-card__eyebrow">Phase 4</span>
            <strong>Bitsocial Network</strong>
            <span>
              The appchain layer proposed to power shared liquidity, decentralized domains, and
              durable incentives across apps.
            </span>
          </Link>
          <Link className="docs-card" to="/decentralize-all-social-media/">
            <span className="docs-card__eyebrow">Phase 5</span>
            <strong>Decentralize all social media</strong>
            <span>
              The end-state: many public RPCs, competing apps, portable identities, and optional
              feed markets instead of captive platforms.
            </span>
          </Link>
        </div>
      </section>

      <section className="docs-home__section">
        <div className="docs-home__section-header">
          <p className="docs-kicker">Apps</p>
          <h2>Clients built on the Bitsocial protocol.</h2>
          <p>
            Each app provides a different interface to the same decentralized network. Communities
            and content are interoperable across all of them.
          </p>
        </div>
        <div className="docs-home__grid">
          <Link className="docs-card" to="/apps/5chan/">
            <span className="docs-card__eyebrow">Imageboard</span>
            <strong>5chan</strong>
            <span>
              A decentralized imageboard where anyone can create and own boards, and multiple boards
              compete for each directory slot.
            </span>
          </Link>
          <Link className="docs-card" to="/apps/seedit/">
            <span className="docs-card__eyebrow">Forum</span>
            <strong>Seedit</strong>
            <span>
              An old.reddit-style alternative where communities are user-owned and compete for
              default listing slots.
            </span>
          </Link>
        </div>
      </section>

      <section className="docs-home__section">
        <div className="docs-home__section-header">
          <p className="docs-kicker">Developer tools</p>
          <h2>Build on the protocol with hooks and CLI tooling.</h2>
          <p>
            Libraries and tools for developers building Bitsocial clients, bots, or community
            management workflows.
          </p>
        </div>
        <div className="docs-home__grid">
          <Link className="docs-card" to="/developer-tools/react-hooks/">
            <span className="docs-card__eyebrow">React</span>
            <strong>React Hooks</strong>
            <span>
              A hooks API for fetching feeds, comments, profiles, publishing content, and managing
              accounts — all without a central server.
            </span>
          </Link>
          <Link className="docs-card" to="/developer-tools/cli/">
            <span className="docs-card__eyebrow">CLI</span>
            <strong>Bitsocial CLI</strong>
            <span>
              Command-line interface for running a P2P node, creating communities, and managing
              settings.
            </span>
          </Link>
        </div>
      </section>

      <section className="docs-home__section">
        <div className="docs-home__section-header">
          <p className="docs-kicker">Anti-spam challenges</p>
          <h2>Modular challenges communities can mix and match.</h2>
          <p>
            Each challenge type is a standalone package that communities can enable, configure, and
            combine to fit their moderation needs.
          </p>
        </div>
        <div className="docs-home__grid">
          <Link className="docs-card" to="/anti-spam/spam-blocker/">
            <span className="docs-card__eyebrow">Risk scoring</span>
            <strong>Spam Blocker</strong>
            <span>
              A centralized risk-scoring service with OAuth and CAPTCHA challenges, dynamic rate
              limiting, and a network indexer.
            </span>
          </Link>
          <Link className="docs-card" to="/anti-spam/captcha-canvas-challenge/">
            <span className="docs-card__eyebrow">Image captcha</span>
            <strong>Captcha Canvas</strong>
            <span>
              Generates image captchas with configurable characters, dimensions, and colors.
            </span>
          </Link>
          <Link className="docs-card" to="/anti-spam/voucher-challenge/">
            <span className="docs-card__eyebrow">Invite codes</span>
            <strong>Voucher Challenge</strong>
            <span>
              Gate publishing behind unique voucher codes distributed by community owners to trusted
              users.
            </span>
          </Link>
          <Link className="docs-card" to="/anti-spam/evm-contract-call/">
            <span className="docs-card__eyebrow">On-chain</span>
            <strong>EVM Contract Call</strong>
            <span>
              Verify on-chain conditions — token balances, NFT ownership, or any smart contract
              state — before allowing a post.
            </span>
          </Link>
        </div>
      </section>

      <section className="docs-home__section">
        <div className="docs-home__section-header">
          <p className="docs-kicker">Infrastructure</p>
          <h2>Supporting services and protocol-level tooling.</h2>
          <p>
            Name resolution, identity verification, and cross-platform integrations that underpin
            the Bitsocial ecosystem.
          </p>
        </div>
        <div className="docs-home__grid">
          <Link className="docs-card" to="/infrastructure/bso-resolver/">
            <span className="docs-card__eyebrow">Names</span>
            <strong>BSO Resolver</strong>
            <span>
              Resolves .bso domain names to public keys via ENS TXT records, with caching for Node
              and browser.
            </span>
          </Link>
          <Link className="docs-card" to="/infrastructure/mintpass/">
            <span className="docs-card__eyebrow">Identity</span>
            <strong>Mintpass</strong>
            <span>
              NFT-based proof-of-personhood via SMS verification, reducing sybil attacks like fake
              votes and ban evasion.
            </span>
          </Link>
          <Link className="docs-card" to="/infrastructure/telegram-bots/">
            <span className="docs-card__eyebrow">Bots</span>
            <strong>Telegram Bots</strong>
            <span>
              Feed bots that monitor Bitsocial communities and forward new posts to Telegram
              channels.
            </span>
          </Link>
        </div>
      </section>

      <section className="docs-home__section">
        <div className="docs-home__section-header">
          <p className="docs-kicker">Contributor reference</p>
          <h2>
            Keep the repo workflow docs visible instead of hiding them in a raw markdown folder.
          </h2>
          <p>
            The existing docs under <code>/docs/agent-playbooks</code> are preserved and published
            here for transparency. They are primarily contributor-facing, but they now live inside
            the docs UI like the public-facing pages do.
          </p>
        </div>
        <div className="docs-home__grid">
          <Link className="docs-card" to="/agent-playbooks/">
            <span className="docs-card__eyebrow">Workflow</span>
            <strong>Contributor playbooks</strong>
            <span>
              Hooks setup, bug investigation, translation workflow, long-running agent handoffs, and
              other repo-specific operating rules.
            </span>
          </Link>
          <Link className="docs-card" to="/agent-playbooks/templates/">
            <span className="docs-card__eyebrow">Templates</span>
            <strong>Progress and feature-list templates</strong>
            <span>
              Reference documents for long-running work, including the machine-readable feature list
              template used by the repo workflow.
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
