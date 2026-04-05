import { useTranslation } from "react-i18next";
import Topbar from "@/components/topbar";
import Footer from "@/components/footer";

type PrivacySection = {
  title: string;
  body: string[];
};

type PrivacyCopy = {
  eyebrow: string;
  title: string;
  sections: {
    summary: PrivacySection;
    uses: PrivacySection;
    cookies: PrivacySection;
    choices: PrivacySection;
  };
  contact: {
    title: string;
    body: string;
  };
};

const PRIVACY_FALLBACK: PrivacyCopy = {
  eyebrow: "How bitsocial.net handles data",
  title: "Privacy Notice",
  sections: {
    summary: {
      title: "Summary",
      body: [
        "bitsocial.net collects very little data.",
        "The code for bitsocial.net is free and open source and lives in the public bitsocial-web repository.",
        "If you sign up for the newsletter, the email address you enter is sent to the mailing-list service configured for the site.",
        "Other than that, bitsocial.net uses privacy-focused traffic and performance measurement, stores your language preference in browser storage, and loads fonts from Google Fonts.",
      ],
    },
    uses: {
      title: "What bitsocial.net uses",
      body: [
        "Newsletter signup sends your email address to the configured mailing-list endpoint only when you submit the form.",
        "Vercel Web Analytics and Speed Insights are used on bitsocial.net for aggregate traffic and performance measurement.",
        "The about site and docs site store your language choice in browser storage so the interface can reopen in the language you selected.",
        "The public pages load fonts from Google Fonts, so your browser connects to Google's font servers.",
      ],
    },
    cookies: {
      title: "Cookies and storage",
      body: [
        "bitsocial.net does not use Google Analytics, Google Tag Manager, Meta Pixel, Hotjar, or similar advertising or profiling scripts on the public site.",
        "bitsocial.net tries to avoid non-essential tracking cookies.",
        "The site does use browser storage for language preference, and the stats surface may rely on strictly necessary Grafana session state for administrator login.",
        "There is no cookie banner right now because the public site is limited to language-preference storage and privacy-focused measurement. If that changes, this page should change too.",
      ],
    },
    choices: {
      title: "Your choices",
      body: [
        "You can avoid newsletter processing by not submitting the signup form.",
        "You can clear the language preference at any time by clearing site storage in your browser.",
        "You can block remote font requests with browser or network controls, although doing so may change the site's appearance.",
        "We will update this page if the public site starts using additional tracking, embeds, or signup flows.",
        "This version was last updated on April 5, 2026.",
      ],
    },
  },
  contact: {
    title: "Contact",
    body: "Questions or corrections about this page can be sent to",
  },
};

export default function Privacy() {
  const { t } = useTranslation();
  const privacy: PrivacyCopy = {
    eyebrow: t("privacy.eyebrow", { defaultValue: PRIVACY_FALLBACK.eyebrow }),
    title: t("privacy.title", { defaultValue: PRIVACY_FALLBACK.title }),
    sections: {
      summary: {
        title: t("privacy.sections.summary.title", {
          defaultValue: PRIVACY_FALLBACK.sections.summary.title,
        }),
        body: t("privacy.sections.summary.body", {
          returnObjects: true,
          defaultValue: PRIVACY_FALLBACK.sections.summary.body,
        }) as string[],
      },
      uses: {
        title: t("privacy.sections.uses.title", {
          defaultValue: PRIVACY_FALLBACK.sections.uses.title,
        }),
        body: t("privacy.sections.uses.body", {
          returnObjects: true,
          defaultValue: PRIVACY_FALLBACK.sections.uses.body,
        }) as string[],
      },
      cookies: {
        title: t("privacy.sections.cookies.title", {
          defaultValue: PRIVACY_FALLBACK.sections.cookies.title,
        }),
        body: t("privacy.sections.cookies.body", {
          returnObjects: true,
          defaultValue: PRIVACY_FALLBACK.sections.cookies.body,
        }) as string[],
      },
      choices: {
        title: t("privacy.sections.choices.title", {
          defaultValue: PRIVACY_FALLBACK.sections.choices.title,
        }),
        body: t("privacy.sections.choices.body", {
          returnObjects: true,
          defaultValue: PRIVACY_FALLBACK.sections.choices.body,
        }) as string[],
      },
    },
    contact: {
      title: t("privacy.contact.title", { defaultValue: PRIVACY_FALLBACK.contact.title }),
      body: t("privacy.contact.body", { defaultValue: PRIVACY_FALLBACK.contact.body }),
    },
  };
  const sections = [
    privacy.sections.summary,
    privacy.sections.uses,
    privacy.sections.cookies,
    privacy.sections.choices,
  ];

  return (
    <div className="min-h-screen">
      <Topbar />
      <main className="px-6 pb-16 pt-28 md:pb-20 md:pt-32">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="mb-3 text-xs font-display uppercase tracking-[0.2em] text-muted-foreground/65">
              {privacy.eyebrow}
            </p>
            <h1 className="max-w-3xl text-4xl font-display font-normal text-balance text-muted-foreground dark:text-foreground/90 md:text-5xl">
              {privacy.title}
            </h1>
          </div>

          <div className="glass-card space-y-8 p-6 md:p-10">
            {sections.map((section) => (
              <section key={section.title} className="space-y-3">
                <h2 className="text-xl font-display font-semibold text-foreground/90 md:text-2xl">
                  {section.title}
                </h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}

            <section className="space-y-3 border-t border-border/40 pt-8">
              <h2 className="text-xl font-display font-semibold text-foreground/90 md:text-2xl">
                {privacy.contact.title}
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                {privacy.contact.body}{" "}
                <a
                  href="mailto:privacy@bitsocial.net"
                  className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-blue-glow"
                >
                  privacy@bitsocial.net
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
