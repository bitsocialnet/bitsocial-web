import { ArrowDown, ArrowRight } from "lucide-react";
import { BSO_RESOLVER_URL } from "@/lib/site";
import Section from "./Section";

export default function BsoNames() {
  return (
    <Section
      id="bso-names"
      eyebrow="The .bso namespace"
      question="Already using .bso names? They're already yours."
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
          through ENS: anime-and-manga.bso is anime-and-manga.eth carrying a bitsocial text record
          that points at the community's public key. When the native .bso registry launches on
          Bitsocial Chain, every name already in use migrates by airdrop: the wallet that owns the
          .eth name and its bitsocial record receives the real .bso name automatically. Nothing to
          re-register, nothing to buy.
        </>
      }
      quote="The namespace launches the way the token did: airdropped, never sold."
    >
      <div className="bso-map">
        <div className="bso-card">
          <span className="bso-card-badge">ENS · today</span>
          <span className="bso-row-name">anime-and-manga.eth</span>
          <span className="bso-row-record">
            <span className="bso-row-key">text · bitsocial</span>
            <ArrowRight aria-hidden size={13} strokeWidth={1.85} />
            <span className="bso-row-value">12D3KooW…Sh7zR</span>
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
          <span className="bso-row-name bso-row-name-next">anime-and-manga.bso</span>
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
