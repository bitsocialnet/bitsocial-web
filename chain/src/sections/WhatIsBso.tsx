import { Link2 } from "lucide-react";
import { BSO_RESOLVER_URL, ETHERSCAN_TOKEN_URL, PROOF_OF_CONCEPT_URL } from "@/lib/site";
import Section from "./Section";

export default function WhatIsBso() {
  return (
    <Section
      id="what-is-bso"
      eyebrow="Token and Chain"
      question="What is BSO?"
      supporting="BSO is an ERC-20: an ordinary Ethereum token any wallet can hold, first issued in 2022 and frozen in an unchangeable contract since July 2026. Bitsocial Chain is a proposal, not a product."
    >
      <div className="premise">
        <div className="premise-half">
          {/* Badge wording is the roadmap's own Now / Proposed vocabulary, so this
              ledger and #master-plan cannot drift apart. */}
          <span className="premise-badge">Now</span>
          <span className="premise-name">BSO and Bitsocial</span>
          <span className="premise-note">The token and the network, running today</span>
          <ul className="premise-traits premise-traits-present">
            <li>
              The{" "}
              <a
                className="section-link"
                href={ETHERSCAN_TOKEN_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                BSO contract
              </a>{" "}
              on Ethereum, unchangeable since July 2026
            </li>
            <li>
              .bso names,{" "}
              <a
                className="section-link"
                href={BSO_RESOLVER_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                resolving through ENS
              </a>
            </li>
            <li>Bitsocial communities, running peer-to-peer</li>
            <li>
              The chain's{" "}
              <a
                className="section-link"
                href={PROOF_OF_CONCEPT_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                proof of concept
              </a>
              , open source
            </li>
          </ul>
        </div>

        <div className="premise-joint" aria-hidden="true">
          <Link2 size={18} strokeWidth={1.8} className="premise-joint-icon" />
        </div>

        <div className="premise-half premise-half-next">
          <span className="premise-badge premise-badge-next">Proposed</span>
          <span className="premise-name premise-name-next">Bitsocial Chain</span>
          <span className="premise-note">
            An Ethereum layer where the money and the names would live
          </span>
          <ul className="premise-traits premise-traits-present">
            <li>The native .bso registry</li>
            <li>Community layers and their tokens</li>
            <li>On-chain ad auctions</li>
            <li>AgoraSwap</li>
          </ul>
        </div>

        <p className="premise-caption">Nothing on the right exists yet.</p>
      </div>
    </Section>
  );
}
