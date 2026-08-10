import { ArrowDown, ArrowRight } from "lucide-react";
import Section from "./Section";

export default function BsoNames() {
  return (
    <Section
      id="bso-names"
      eyebrow="The .bso Namespace"
      question="Nothing to re-register. Nothing to buy."
      supporting="A .bso name works today by borrowing ENS, the naming system Ethereum wallets use: mycommunity.bso is really mycommunity.eth. The proposed registry would airdrop every name already in use to the wallet that holds it."
      quote="The namespace launches the way the token did: airdropped, never sold."
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
          <span className="bso-card-badge bso-card-badge-next">.bso · Bitsocial Chain</span>
          <span className="phase-status phase-status-proposed bso-card-status">Proposed</span>
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
