import { AnimatePresence, m } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

type EasterEggOverlayProps = {
  alt?: string;
  ariaLabel?: string;
  children?: ReactNode;
  contentClassName?: string;
  contentInitialScale?: number;
  imageSrc?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function EasterEggOverlay({
  alt,
  ariaLabel,
  children,
  contentClassName,
  contentInitialScale = 0.8,
  imageSrc,
  open,
  onOpenChange,
}: EasterEggOverlayProps) {
  const label = ariaLabel ?? alt;
  const resolvedContentClassName =
    contentClassName ??
    (imageSrc
      ? "max-w-[90vw] max-h-[90vh] cursor-pointer"
      : "max-h-[90vh] w-[min(1120px,calc(100vw-2rem))] overflow-y-auto");
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();
      onOpenChange(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onOpenChange, open]);

  const overlay = (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        >
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className={resolvedContentClassName}
            onMouseDown={(e) => {
              e.stopPropagation();
              if (imageSrc) {
                e.preventDefault();
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (imageSrc) {
                e.preventDefault();
                onOpenChange(false);
              }
            }}
            initial={{ scale: contentInitialScale }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {imageSrc ? (
              <img src={imageSrc} alt={alt ?? ""} className="max-h-[90vh] max-w-[90vw]" />
            ) : (
              children
            )}
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") {
    return overlay;
  }

  return createPortal(overlay, document.body);
}
