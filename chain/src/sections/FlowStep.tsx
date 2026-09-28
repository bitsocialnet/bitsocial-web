import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type FlowStepProps = {
  icon: LucideIcon;
  label: string;
  note: string;
  children?: ReactNode;
};

// One item of the `.flow-steps` grid; `children` carries extras such as the
// connecting arrow in a sequence.
export default function FlowStep({ icon: Icon, label, note, children }: FlowStepProps) {
  return (
    <li className="flow-step">
      <span className="flow-icon">
        <Icon aria-hidden size={18} strokeWidth={1.8} />
      </span>
      <span className="flow-label">{label}</span>
      <span className="flow-note">{note}</span>
      {children}
    </li>
  );
}
