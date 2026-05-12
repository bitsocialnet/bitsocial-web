import type { ReactNode } from "react";
import { Github, Send } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import Footer from "@/components/footer";
import Topbar from "@/components/topbar";

type TeamLink = {
  label?: string;
  labelKey?: string;
  href: string;
  icon: ReactNode;
};

type TeamMember = {
  name: string;
  roleKey: string;
  links: TeamLink[];
  githubLogin: string;
  richRole?: boolean;
};

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function BlueskyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 530" fill="currentColor" className={className} aria-hidden="true">
      <path d="M130.8 36.2c66.2 49.7 137.4 150.5 169.2 216.3 31.8-65.7 103-166.6 169.2-216.3 47.8-35.8 125.2-63.5 125.2 24.8 0 17.6-10.1 148.1-16.1 169.2-20.9 73.4-97 92.1-164.7 80.5 118.4 20.3 148.5 87.4 83.4 154.5-123.6 127.4-177.6-32-191.4-72.8-2.5-7.5-3.7-11-5.6-11s-3 3.5-5.6 11c-13.7 40.8-67.8 200.2-191.4 72.8-65.1-67.1-34.9-134.2 83.4-154.5-67.8 11.6-143.8-7.1-164.7-80.5-6-21.1-16.1-151.6-16.1-169.2 0-88.2 77.4-60.6 125.2-24.8Z" />
    </svg>
  );
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Esteban Abaroa",
    roleKey: "about.members.esteban.role",
    githubLogin: "estebanabaroa",
    links: [
      {
        labelKey: "footer.telegram",
        href: "https://t.me/estebanabaroa",
        icon: <Send className="h-4 w-4" />,
      },
      {
        label: "X",
        href: "https://x.com/estebanabaroa",
        icon: <XIcon className="h-3.5 w-3.5" />,
      },
      {
        label: "Bluesky",
        href: "https://bsky.app/profile/estebanabaroa.bsky.social",
        icon: <BlueskyIcon className="h-3.5 w-3.5" />,
      },
      {
        labelKey: "footer.github",
        href: "https://github.com/estebanabaroa",
        icon: <Github className="h-4 w-4" />,
      },
    ],
  },
  {
    name: "Rinse12",
    roleKey: "about.members.rinse.role",
    githubLogin: "rinse12",
    links: [
      {
        labelKey: "footer.telegram",
        href: "https://t.me/rinse12",
        icon: <Send className="h-4 w-4" />,
      },
      {
        label: "X",
        href: "https://x.com/rinse_12",
        icon: <XIcon className="h-3.5 w-3.5" />,
      },
      {
        label: "Bluesky",
        href: "https://bsky.app/profile/rinse-bitsocial.bsky.social",
        icon: <BlueskyIcon className="h-3.5 w-3.5" />,
      },
      {
        labelKey: "footer.github",
        href: "https://github.com/rinse12",
        icon: <Github className="h-4 w-4" />,
      },
    ],
  },
  {
    name: "Tommaso Casaburi",
    roleKey: "about.members.tommaso.role",
    githubLogin: "tomcasaburi",
    richRole: true,
    links: [
      {
        labelKey: "footer.telegram",
        href: "https://t.me/tomcasaburi",
        icon: <Send className="h-4 w-4" />,
      },
      {
        label: "X",
        href: "https://x.com/tomcasaburi",
        icon: <XIcon className="h-3.5 w-3.5" />,
      },
      {
        label: "Bluesky",
        href: "https://bsky.app/profile/tomcasaburi.bsky.social",
        icon: <BlueskyIcon className="h-3.5 w-3.5" />,
      },
      {
        labelKey: "footer.github",
        href: "https://github.com/tomcasaburi",
        icon: <Github className="h-4 w-4" />,
      },
    ],
  },
];

function getGithubAvatarUrl(login: string) {
  return `https://github.com/${login}.png?size=160`;
}

function ExternalLinkPill({ href, label, labelKey, icon }: TeamLink) {
  const { t } = useTranslation();
  const resolvedLabel = label ?? t(labelKey ?? "");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={resolvedLabel}
      title={resolvedLabel}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/70 text-muted-foreground transition-colors hover:text-foreground"
    >
      {icon}
    </a>
  );
}

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <Topbar />
      <main className="px-6 pb-12 pt-24">
        <div className="mx-auto max-w-4xl space-y-8">
          <section aria-labelledby="about-heading" className="space-y-6">
            <div className="max-w-2xl">
              <p className="text-xs font-display uppercase tracking-[0.2em] text-foreground/45">
                {t("about.sectionLabel")}
              </p>
              <h1
                id="about-heading"
                className="optical-display-start mt-4 text-4xl font-display font-semibold leading-[1.1] text-balance text-muted-foreground md:text-6xl lg:text-7xl"
              >
                {t("about.title")}
              </h1>
              <p className="mt-3 max-w-2xl text-base md:text-lg text-balance leading-relaxed text-muted-foreground">
                <Trans
                  i18nKey="about.subtitle"
                  components={{
                    pkcLink: (
                      <a
                        href="https://github.com/pkcprotocol"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-muted-foreground"
                      />
                    ),
                  }}
                />
              </p>
            </div>
            <div className="space-y-4">
              {TEAM_MEMBERS.map((member) => (
                <article key={member.name} className="glass-card p-6 md:p-7">
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <img
                        src={getGithubAvatarUrl(member.githubLogin)}
                        alt={t("about.memberProfileAlt", { name: member.name })}
                        loading="lazy"
                        width={80}
                        height={80}
                        className="h-16 w-16 shrink-0 rounded-full border border-border/60 bg-background/70 object-cover md:h-20 md:w-20"
                      />
                      <div className="min-w-0 space-y-2">
                        <h3 className="text-2xl font-display font-semibold text-foreground">
                          {member.name}
                        </h3>
                        <p className="max-w-2xl leading-relaxed text-muted-foreground">
                          {member.richRole ? (
                            <Trans
                              i18nKey={member.roleKey}
                              components={{
                                forgeLink: (
                                  <a
                                    href="https://bitsocialforge.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-muted-foreground"
                                  />
                                ),
                              }}
                            />
                          ) : (
                            t(member.roleKey)
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-nowrap gap-2 md:justify-end">
                      {member.links.map((link) => (
                        <ExternalLinkPill key={link.href} {...link} />
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
