import { useTranslation } from "react-i18next";

const PHASES = [
  { key: "active", grow: 6 },
  { key: "grace", grow: 2.4 },
  { key: "premium", grow: 1.6 },
  { key: "open", grow: 1.4 },
] as const;

export default function Lifecycle() {
  const { t } = useTranslation();

  return (
    <section className="rl-section" aria-labelledby="nm-life-title">
      <p className="nm-eyebrow">{t("names.lifecycle.eyebrow")}</p>
      <h2 id="nm-life-title" className="rl-section-title">
        {t("names.lifecycle.title")}
      </h2>
      <p className="rl-section-lead">{t("names.lifecycle.lead")}</p>
      <figure className="nm-life">
        <div className="nm-life-bar">
          {PHASES.map((phase) => (
            <div
              key={phase.key}
              className="nm-life-phase"
              data-phase={phase.key}
              style={{ flexGrow: phase.grow }}
            >
              <p className="nm-life-name">{t(`names.lifecycle.${phase.key}`)}</p>
              <p className="nm-life-note">{t(`names.lifecycle.${phase.key}Note`)}</p>
            </div>
          ))}
        </div>
        <figcaption className="rl-note">{t("names.lifecycle.caption")}</figcaption>
      </figure>
    </section>
  );
}
