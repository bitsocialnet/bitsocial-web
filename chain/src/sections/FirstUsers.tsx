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

export default function FirstUsers() {
  return (
    <Section
      id="first-users"
      title="Who would use it first?"
      supporting="Developers and community operators, before anyone else. Bitsocial's own adoption argument is that monetization is what carries a network past the point where most of them stall, and monetization is the part that does not exist yet."
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
