import { AtSign, Coins, Users } from "lucide-react";
import Section from "./Section";

const GAPS = [
  {
    icon: AtSign,
    title: "Names are borrowed.",
    body: (
      <>
        A .bso name is really an ENS name today, which means{" "}
        <strong>the registry every Bitsocial name depends on belongs to another network</strong>.
      </>
    ),
    answer: "The registry",
    answeredBy: "bso-names",
  },
  {
    icon: Coins,
    title: "Tipping has nowhere to land.",
    body: (
      <>
        <strong>Awards, tipping and practical monetization are Phase 2, not built.</strong> A
        community can gather people today, but it cannot pay them.
      </>
    ),
    answer: "Ads and tips",
    answeredBy: "programmable-revenue",
  },
  {
    icon: Users,
    title: "Every community starts from zero.",
    body: (
      <>
        There is no shared asset and no common liquidity, so{" "}
        <strong>each new community has to bootstrap its own economy from zero</strong>.
      </>
    ),
    answer: "Community money",
    answeredBy: "settlement-layer",
  },
];

export default function Problem() {
  return (
    <Section
      id="problem"
      eyebrow="The Missing Piece"
      question="Your keys hold the community. Not the money."
      supporting="On Bitsocial a profile and a community are private keys you hold, not accounts a company can revoke. Payments never got the same treatment. That leaves three gaps."
      quote="A decentralized social network needs decentralized money."
      quoteAttribution="— Esteban Abaroa, Bitsocial founder"
    >
      <div className="cards">
        {GAPS.map((gap) => {
          const Icon = gap.icon;
          return (
            <article key={gap.title} className="card">
              <span className="card-icon" aria-hidden="true">
                <Icon aria-hidden size={18} strokeWidth={1.8} />
              </span>
              <h3 className="card-title">{gap.title}</h3>
              <p className="card-body">{gap.body}</p>
              <div className="card-foot">
                <span className="card-foot-label">Answered in</span>
                <a className="card-link" href={`#${gap.answeredBy}`}>
                  {gap.answer}
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
