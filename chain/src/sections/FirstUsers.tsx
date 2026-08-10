import { Globe, Store, Terminal } from "lucide-react";
import Section from "./Section";

const COHORTS = [
  {
    icon: Terminal,
    title: "Developers go first.",
    body: (
      <>
        <strong>Testers, developers and protocol builders prove the apps</strong>, and earn
        first-mover visibility for showing up before anyone else does.
      </>
    ),
  },
  {
    icon: Store,
    title: "Operators follow the money.",
    body: (
      <>
        Creators and operators follow when{" "}
        <strong>monetization makes a community worth building around</strong>, which is the part
        that does not exist yet.
      </>
    ),
  },
  {
    icon: Globe,
    title: "Everyone else waits for proof.",
    body: (
      <>
        Mainstream users trust the network once{" "}
        <strong>resilience proves it works every day</strong>, and they never have to know what runs
        underneath.
      </>
    ),
  },
];

// id stays `endgame` so existing deep links survive the reframe.
export default function FirstUsers() {
  return (
    <Section
      id="endgame"
      eyebrow="The First Users"
      question="Whoever wants to keep what they earn."
      supporting="Bitsocial's own adoption curve says monetization is what carries the network past the point where most networks die. That is the part Bitsocial Chain is proposed to supply. Here is who arrives first."
    >
      <div className="cards">
        {COHORTS.map((cohort) => {
          const Icon = cohort.icon;
          return (
            <article key={cohort.title} className="card">
              <span className="card-icon" aria-hidden="true">
                <Icon aria-hidden size={18} strokeWidth={1.8} />
              </span>
              <h3 className="card-title">{cohort.title}</h3>
              <p className="card-body">{cohort.body}</p>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
