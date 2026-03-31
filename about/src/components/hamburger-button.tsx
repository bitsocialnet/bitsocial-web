import { m } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    onClick();
    // Blur on mobile to remove persistent focus outline
    requestAnimationFrame(() => {
      buttonRef.current?.blur();
    });
  };

  return (
    <Button
      ref={buttonRef}
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-none hover:bg-transparent focus:bg-transparent active:bg-transparent"
      onClick={handleClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <div className="relative h-5 w-5 flex items-center justify-center">
        <m.span
          className="absolute h-0.5 w-5 bg-muted-foreground rounded-full will-change-transform"
          initial={{ rotate: 0, y: -6 }}
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 0 : -6,
          }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        />
        <m.span
          className="absolute h-0.5 w-5 bg-muted-foreground rounded-full will-change-transform"
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            opacity: isOpen ? 0 : 1,
            scale: isOpen ? 0 : 1,
          }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        />
        <m.span
          className="absolute h-0.5 w-5 bg-muted-foreground rounded-full will-change-transform"
          initial={{ rotate: 0, y: 6 }}
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? 0 : 6,
          }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </Button>
  );
}
