import { ArrowDown, ArrowRight } from "lucide-react";
import { BSO_RESOLVER_URL } from "@/lib/site";
import Section from "./Section";

export default function BsoNames() {
  return (
    <Section
      id="bso-names"
      eyebrow="BSO Names"
      question="Already using a .bso name? It stays yours."
      supporting={
        <>
          Bitsocial apps{" "}
          <a
            className="section-link"
            href={BSO_RESOLVER_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            resolve .bso names today
          </a>{" "}
          by borrowing ENS, the naming system Ethereum wallets use: mycommunity.bso is really
          mycommunity.eth carrying a bitsocial record. A native registry would airdrop every name
          already in use to the wallet that holds it — nothing to claim and nothing to re-register.
        </>
      }
    >
      <div className="bso-map">
        <div className="bso-card">
          <span className="bso-card-badge">ENS · today</span>
          <span className="bso-row-name">mycommunity.eth</span>
          <span className="bso-row-record">
            <span className="bso-row-key">points to</span>
            <ArrowRight aria-hidden size={13} strokeWidth={1.85} />
            <span className="bso-row-value">the community's key</span>
          </span>
        </div>

        <div className="bso-connector" aria-hidden="true">
          <ArrowRight
            size={18}
            strokeWidth={1.8}
            className="bso-connector-arrow bso-connector-arrow-row"
          />
          <ArrowDown
            size={18}
            strokeWidth={1.8}
            className="bso-connector-arrow bso-connector-arrow-column"
          />
          <span className="bso-connector-pill">airdrop at launch</span>
        </div>

        <div className="bso-card bso-card-next">
          <span className="bso-card-badges">
            <span className="bso-card-badge bso-card-badge-next">.bso · Bitsocial Chain</span>
            <span className="bso-card-badge">Proposed</span>
          </span>
          <span className="bso-row-name bso-row-name-next">mycommunity.bso</span>
          <span className="bso-row-record">
            <span className="bso-row-key">owner</span>
            <ArrowRight aria-hidden size={13} strokeWidth={1.85} />
            <span className="bso-row-value bso-row-value-next">the same wallet</span>
          </span>
        </div>
      </div>
    </Section>
  );
}
