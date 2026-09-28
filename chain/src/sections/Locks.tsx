import { Ban } from "lucide-react";

type Lock = { label: string; note: string };

/** The grid of "No …" guarantees shared by the token (#tokenomics) and the chain (#unstoppable). */
export default function Locks({ locks }: { locks: readonly Lock[] }) {
  return (
    <div className="spec-locks">
      {locks.map((lock) => (
        <div key={lock.label} className="lock">
          <Ban aria-hidden size={16} strokeWidth={1.9} className="lock-icon" />
          <span className="lock-text">
            <span className="lock-label">{lock.label}</span>
            <span className="lock-note">{lock.note}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
