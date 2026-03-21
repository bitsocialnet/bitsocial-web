import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  children: React.ReactNode;
  onExitComplete?: () => void;
}

export default function MobileMenu({ isOpen, children, onExitComplete }: MobileMenuProps) {
  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{
            duration: 0.28,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="overflow-hidden md:hidden"
        >
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.22,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4"
          >
            {children}
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
