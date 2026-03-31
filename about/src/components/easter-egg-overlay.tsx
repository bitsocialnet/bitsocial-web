import { AnimatePresence, m } from "framer-motion";
import { createPortal } from "react-dom";

type EasterEggOverlayProps = {
  alt: string;
  imageSrc: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function EasterEggOverlay({
  alt,
  imageSrc,
  open,
  onOpenChange,
}: EasterEggOverlayProps) {
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
          <m.img
            src={imageSrc}
            alt={alt}
            className="max-w-[90vw] max-h-[90vh] cursor-pointer"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenChange(false);
            }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </m.div>
      )}
    </AnimatePresence>
  );

  return createPortal(overlay, document.body);
}
