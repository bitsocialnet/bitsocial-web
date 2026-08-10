import { AppWindow, PiggyBank, UsersRound } from "lucide-react";
import { ABOUT_URL, FIVECHAN_URL, GITHUB_URL, SEEDIT_URL, STATS_SITE_URL } from "@/lib/site";
import Section from "./Section";

const TEAM = [
  { name: "Esteban Abaroa", role: "Founder and Lead Developer" },
  { name: "Rinse12", role: "Co-Founder and Core Developer" },
  {
    name: "Tommaso Casaburi",
    role: "Co-Founder and Core Developer, Founder & CEO of Bitsocial Forge",
  },
];

const RUNNING = [
  { label: "Open 5chan", href: FIVECHAN_URL },
  { label: "Try Seedit", href: SEEDIT_URL },
  { label: "See live stats", href: STATS_SITE_URL },
  { label: "Read the code", href: GITHUB_URL },
];

export default function WhoBuildsIt() {
  return (
    <Section
      id="who-builds-it"
      eyebrow="The Core Team"
      question="Self-funded since early 2022."
      supporting="Bitsocial has been in development since early 2022, funded by founder Esteban Abaroa out of his own savings. The protocol itself has no owner. Bitsocial Forge builds clients and services on top of it."
    >
      <div className="cards">
        <article className="card">
          <span className="card-icon" aria-hidden="true">
            <UsersRound aria-hidden size={18} strokeWidth={1.8} />
          </span>
          <h3 className="card-title">Three people build it.</h3>
          <ul className="card-people">
            {TEAM.map((member) => (
              <li key={member.name}>
                <span className="card-person-name">{member.name}</span>
                <span className="card-person-role">{member.role}</span>
              </li>
            ))}
          </ul>
          <div className="card-foot">
            <a className="card-link" href={ABOUT_URL} target="_blank" rel="noopener noreferrer">
              Meet the team
            </a>
          </div>
        </article>

        <article className="card">
          <span className="card-icon" aria-hidden="true">
            <PiggyBank aria-hidden size={18} strokeWidth={1.8} />
          </span>
          <h3 className="card-title">Funded out of savings.</h3>
          <p className="card-body">
            Bitsocial has been in active development since early 2022, a grassroots project{" "}
            <strong>funded from day one by the founder out of his own savings</strong>.
          </p>
        </article>

        <article className="card">
          <span className="card-icon" aria-hidden="true">
            <AppWindow aria-hidden size={18} strokeWidth={1.8} />
          </span>
          <h3 className="card-title">Some of it already runs.</h3>
          <p className="card-body">
            <strong>5chan is the first public Bitsocial client, ready today.</strong> Seedit is the
            first prototype Bitsocial app for Reddit-style discussion. The traffic and the code are
            public.
          </p>
          <div className="card-foot">
            <span className="card-foot-label">Check it yourself</span>
            <div className="card-links">
              {RUNNING.map((link) => (
                <a
                  key={link.href}
                  className="card-link"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </article>
      </div>
    </Section>
  );
}
