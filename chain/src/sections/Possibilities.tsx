import { ArrowLeftRight, AtSign, Boxes, Layers, Palette, Puzzle } from "lucide-react";
import { useTranslation } from "react-i18next";
import Section from "./Section";

export default function Possibilities() {
  const { t } = useTranslation();

  const ideas = [
    {
      id: "chain",
      icon: Layers,
      label: "Bitsocial Chain",
      note: t("sections.possibilities.ideas.chain.note"),
    },
    {
      id: "registry",
      icon: AtSign,
      label: t("sections.possibilities.ideas.registry.label"),
      note: t("sections.possibilities.ideas.registry.note"),
    },
    {
      id: "l3s",
      icon: Boxes,
      label: t("sections.possibilities.ideas.l3s.label"),
      note: t("sections.possibilities.ideas.l3s.note"),
    },
    {
      id: "agoraswap",
      icon: ArrowLeftRight,
      label: "AgoraSwap",
      note: t("sections.possibilities.ideas.agoraswap.note"),
    },
    {
      id: "collectibles",
      icon: Palette,
      label: t("sections.possibilities.ideas.collectibles.label"),
      note: t("sections.possibilities.ideas.collectibles.note"),
    },
    {
      id: "other",
      icon: Puzzle,
      label: t("sections.possibilities.ideas.other.label"),
      note: t("sections.possibilities.ideas.other.note"),
    },
  ];

  return (
    <Section
      id="possibilities"
      title={t("sections.possibilities.title")}
      supporting={t("sections.possibilities.supporting")}
    >
      <div className="flywheel">
        <ol className="flow-steps">
          {ideas.map((idea) => {
            const Icon = idea.icon;
            return (
              <li key={idea.id} className="glass-card flow-step">
                <span className="flow-icon">
                  <Icon aria-hidden size={18} strokeWidth={1.8} />
                </span>
                <span className="flow-label">{idea.label}</span>
                <span className="flow-note">{idea.note}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
